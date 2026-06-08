-- SQL Migration for OCR & Voting Feature

-- Enable required extensions
create extension if not exists pgcrypto;
create extension if not exists fuzzystrmatch;

-- 1. Update recipes table with new fields for unique recipes and corrections
alter table recipes add column if not exists is_unique boolean default false;
alter table recipes add column if not exists creator_name text default null;
alter table recipes add column if not exists server_name text default null;
alter table recipes add column if not exists corrected_fields jsonb default null;

-- 2. Create recipe_proofs table to track structural matches
create table if not exists recipe_proofs (
    id uuid default gen_random_uuid() primary key,
    recipe_id uuid references recipes(id) on delete cascade,
    parsed_name text not null,
    parsed_skill text,
    parsed_cooker text,
    parsed_container text,
    parsed_mandatory text,
    source text,
    ip_hash text,
    proof_type text default 'confirmation', -- 'confirmation' or 'correction'
    corrected_fields jsonb default null,
    created_at timestamptz default now()
);

-- Enable RLS on recipe_proofs
alter table recipe_proofs enable row level security;

-- Policies for recipe_proofs
create policy "Anyone can read proofs" on recipe_proofs
    for select using (true);

-- 3. Create recipe_votes table to track anonymous monthly thumbs up
create table if not exists recipe_votes (
    id uuid default gen_random_uuid() primary key,
    recipe_id uuid references recipes(id) on delete cascade,
    ip_hash text not null,
    vote_date date default (now() at time zone 'utc')::date,
    voted_at timestamptz default now()
);

-- Index for 1 vote per day per recipe per IP
create unique index if not exists recipe_votes_daily_unique
    on recipe_votes (recipe_id, ip_hash, vote_date);

-- Enable RLS on recipe_votes
alter table recipe_votes enable row level security;

-- Policies for recipe_votes
create policy "Anyone can read votes" on recipe_votes
    for select using (true);

-- 4. Helper array functions for Jaccard similarity inside SQL
create or replace function array_intersection(anyarray, anyarray)
returns anyarray as $$
    select array(
        select unnest($1)
        intersect
        select unnest($2)
    );
$$ language sql immutable;

create or replace function array_union(anyarray, anyarray)
returns anyarray as $$
    select array(
        select unnest($1)
        union
        select unnest($2)
    );
$$ language sql immutable;

create or replace function jaccard_similarity(anyarray, anyarray)
returns float as $$
declare
    inter_len int;
    union_len int;
begin
    inter_len := cardinality(array_intersection($1, $2));
    union_len := cardinality(array_union($1, $2));
    if union_len = 0 then
        return 1.0;
    end if;
    return inter_len::float / union_len::float;
end;
$$ language plpgsql immutable;

-- 5. Helper text normalizer for Jaccard and string matches
create or replace function normalize_wurm_text(val text)
returns text as $$
begin
    return regexp_replace(lower(trim(val)), '[^a-z0-9\s]', '', 'g');
end;
$$ language plpgsql immutable;

-- 6. RPC function to handle recipe thumbs up voting with time-gate and IP dedup
create or replace function vote_recipe(p_recipe_id uuid)
returns jsonb
security definer
as $$
declare
    client_ip text;
    hashed_ip text;
    vote_exists boolean;
begin
    client_ip := coalesce(current_setting('request.headers', true)::json->>'x-forwarded-for', '127.0.0.1');
    hashed_ip := encode(digest(client_ip, 'sha256'), 'hex');

    -- Check if vote already exists for today
    select exists (
        select 1 from recipe_votes 
        where recipe_id = p_recipe_id 
          and ip_hash = hashed_ip 
          and vote_date = (now() at time zone 'utc')::date
    ) into vote_exists;

    if vote_exists then
        return jsonb_build_object('success', false, 'message', 'already_voted_today');
    end if;

    insert into recipe_votes (recipe_id, ip_hash)
    values (p_recipe_id, hashed_ip);

    return jsonb_build_object('success', true, 'message', 'vote_recorded');
exception
    when others then
        return jsonb_build_object('success', false, 'message', SQLERRM);
end;
$$ language plpgsql;

-- 7. RPC function to handle OCR submissions, auto-verification, and corrections
create or replace function submit_recipe_proof(
    p_name text,
    p_skill text,
    p_cooker text,
    p_container text,
    p_mandatory text,
    p_source text,
    p_is_unique boolean default false,
    p_creator_name text default null,
    p_server_name text default null,
    p_hint_en text default null,
    p_hint_pt text default null,
    p_hint_ru text default null
)
returns jsonb
security definer
as $$
declare
    client_ip text;
    hashed_ip text;
    rate_limit_count int;
    is_trusted boolean;
    best_recipe_id uuid;
    best_recipe_status text;
    best_recipe_mandatory text;
    best_recipe_cooker text;
    best_recipe_container text;
    best_score float := 0.0;
    
    r record;
    name_score float;
    ing_score float;
    cooker_score float;
    container_score float;
    total_score float;
    
    p_ing_arr text[];
    db_ing_arr text[];
    
    new_recipe_id uuid;
    changes jsonb := null;
begin
    -- A. Calculate Hashed IP and check Rate Limit (10 per hour)
    client_ip := coalesce(current_setting('request.headers', true)::json->>'x-forwarded-for', '127.0.0.1');
    hashed_ip := encode(digest(client_ip, 'sha256'), 'hex');

    select count(*) into rate_limit_count
    from recipe_proofs
    where ip_hash = hashed_ip and created_at > now() - interval '1 hour';

    if rate_limit_count >= 10 then
        return jsonb_build_object('success', false, 'message', 'rate_limit_exceeded');
    end if;

    -- B. Check if submitter is a trusted contributor (>=3 verified/legacy_verified recipes submitted)
    if p_source is not null and p_source != '' then
        select count(*) >= 3 into is_trusted
        from recipe_proofs rp
        inner join recipes r on r.id = rp.recipe_id
        where rp.source = p_source and r.status in ('verified', 'legacy_verified');
    else
        is_trusted := false;
    end if;

    -- C. Split parsed ingredients into array
    select array_agg(normalize_wurm_text(val)) into p_ing_arr
    from unnest(string_to_array(p_mandatory, ';')) as val
    where length(trim(val)) > 0;

    -- D. Find the best match in existing recipes
    for r in (
        select id, name, skill, status, mandatory, cooker, container 
        from recipes 
        where status in ('verified', 'legacy_verified', 'pending')
    ) loop
        -- 1. Name score (Levenshtein based string similarity)
        if length(r.name) > 0 and length(p_name) > 0 then
            name_score := 1.0 - (levenshtein(lower(r.name), lower(p_name))::float / greatest(length(r.name), length(p_name), 1));
        else
            name_score := 0.0;
        end if;

        -- 2. Ingredients score (Jaccard similarity)
        select array_agg(normalize_wurm_text(val)) into db_ing_arr
        from unnest(string_to_array(r.mandatory, ';')) as val
        where length(trim(val)) > 0;

        ing_score := jaccard_similarity(p_ing_arr, db_ing_arr);

        -- 3. Cooker / Container score
        if length(coalesce(r.cooker, '')) > 0 and length(coalesce(p_cooker, '')) > 0 then
            cooker_score := 1.0 - (levenshtein(normalize_wurm_text(r.cooker), normalize_wurm_text(p_cooker))::float / greatest(length(r.cooker), length(p_cooker), 1));
        else
            cooker_score := 0.0;
        end if;

        if length(coalesce(r.container, '')) > 0 and length(coalesce(p_container, '')) > 0 then
            container_score := 1.0 - (levenshtein(normalize_wurm_text(r.container), normalize_wurm_text(p_container))::float / greatest(length(r.container), length(p_container), 1));
        else
            container_score := 0.0;
        end if;

        total_score := (name_score * 0.5) + (ing_score * 0.5);

        if total_score > best_score then
            best_score := total_score;
            best_recipe_id := r.id;
            best_recipe_status := r.status;
            best_recipe_mandatory := r.mandatory;
            best_recipe_cooker := r.cooker;
            best_recipe_container := r.container;
        end if;
    end loop;

    -- E. Decision Matrix based on best match
    if best_score >= 0.75 and best_recipe_id is not null then
        -- We found a highly matching existing recipe!
        
        if best_recipe_status in ('verified', 'legacy_verified') then
            -- Check if print data differs (Correction check)
            if normalize_wurm_text(coalesce(p_cooker, '')) != normalize_wurm_text(coalesce(best_recipe_cooker, '')) or
               normalize_wurm_text(coalesce(p_container, '')) != normalize_wurm_text(coalesce(best_recipe_container, '')) or
               ing_score < 0.85 then
                
                -- Apply correction immediately (recipe exists = 1st proof, print = 2nd proof)
                changes := jsonb_build_object(
                    'cooker', p_cooker,
                    'container', p_container,
                    'mandatory', p_mandatory
                );

                update recipes 
                set cooker = p_cooker,
                    container = p_container,
                    mandatory = p_mandatory,
                    status = 'verified',
                    corrected_fields = changes
                where id = best_recipe_id;

                insert into recipe_proofs (recipe_id, parsed_name, parsed_skill, parsed_cooker, parsed_container, parsed_mandatory, source, ip_hash, proof_type, corrected_fields)
                values (best_recipe_id, p_name, p_skill, p_cooker, p_container, p_mandatory, p_source, hashed_ip, 'correction', changes);

                return jsonb_build_object('success', true, 'result', 'corrected', 'recipe_id', best_recipe_id);
            else
                -- Just confirms existing verified data
                insert into recipe_proofs (recipe_id, parsed_name, parsed_skill, parsed_cooker, parsed_container, parsed_mandatory, source, ip_hash, proof_type)
                values (best_recipe_id, p_name, p_skill, p_cooker, p_container, p_mandatory, p_source, hashed_ip, 'confirmation');

                return jsonb_build_object('success', true, 'result', 'confirmed', 'recipe_id', best_recipe_id);
            end if;
            
        elsif best_recipe_status = 'pending' then
            -- Verify if different contributor / different IP (Auto-verification check)
            declare
                original_source text;
                original_ip_hash text;
            begin
                select source, ip_hash into original_source, original_ip_hash
                from recipe_proofs
                where recipe_id = best_recipe_id
                order by created_at asc
                limit 1;

                if (original_source != p_source or p_source is null or p_source = '') and original_ip_hash != hashed_ip then
                    -- 2nd proof is valid! Promote to verified
                    update recipes 
                    set status = 'verified'
                    where id = best_recipe_id;

                    insert into recipe_proofs (recipe_id, parsed_name, parsed_skill, parsed_cooker, parsed_container, parsed_mandatory, source, ip_hash, proof_type)
                    values (best_recipe_id, p_name, p_skill, p_cooker, p_container, p_mandatory, p_source, hashed_ip, 'confirmation');

                    return jsonb_build_object('success', true, 'result', 'auto_verified', 'recipe_id', best_recipe_id);
                else
                    -- Same contributor/IP, just log the confirmation proof
                    insert into recipe_proofs (recipe_id, parsed_name, parsed_skill, parsed_cooker, parsed_container, parsed_mandatory, source, ip_hash, proof_type)
                    values (best_recipe_id, p_name, p_skill, p_cooker, p_container, p_mandatory, p_source, hashed_ip, 'confirmation');

                    return jsonb_build_object('success', true, 'result', 'proof_recorded', 'recipe_id', best_recipe_id);
                end if;
            end;
        end if;

    else
        -- F. Create a new recipe entry (no match found above 75%)
        declare
            target_status text := 'pending';
        begin
            if is_trusted or p_is_unique then
                target_status := 'verified';
            end if;

            insert into recipes (name, skill, cooker, container, mandatory, status, is_unique, creator_name, server_name, hint_en, hint_pt, hint_ru)
            values (p_name, p_skill, p_cooker, p_container, p_mandatory, target_status, p_is_unique, p_creator_name, p_server_name, p_hint_en, p_hint_pt, p_hint_ru)
            returning id into new_recipe_id;

            insert into recipe_proofs (recipe_id, parsed_name, parsed_skill, parsed_cooker, parsed_container, parsed_mandatory, source, ip_hash, proof_type)
            values (new_recipe_id, p_name, p_skill, p_cooker, p_container, p_mandatory, p_source, hashed_ip, 'confirmation');

            return jsonb_build_object(
                'success', true, 
                'result', case when target_status = 'verified' then 'created_verified' else 'created_pending' end, 
                'recipe_id', new_recipe_id
            );
        end;
    end if;

exception
    when others then
        return jsonb_build_object('success', false, 'message', SQLERRM);
end;
$$ language plpgsql;

-- 8. Create top_recipes_monthly view (recreate to ensure compile safety)
create or replace view top_recipes_monthly as
select
    r.id, r.name, r.skill, r.status,
    count(v.id) as vote_count
from recipes r
left join recipe_votes v
  on v.recipe_id = r.id
  and date_trunc('month', v.voted_at) = date_trunc('month', now())
where r.status in ('verified', 'legacy_verified')
group by r.id, r.name, r.skill, r.status
order by vote_count desc
limit 10;

-- 9. Create contributor_stats view (recreate)
create or replace view contributor_stats as
select
    rp.source,
    count(*) as recipe_count
from recipe_proofs rp
inner join recipes r on r.id = rp.recipe_id
where r.status in ('verified', 'legacy_verified')
  and rp.source is not null and rp.source != ''
group by rp.source
order by recipe_count desc
limit 20;

-- 10. Update RLS select policy on recipes to allow reading pending recipes
drop policy if exists "Public read verified recipes" on recipes;
create policy "Public read verified recipes" on recipes for
select using (status in ('verified', 'legacy_verified', 'pending'));

