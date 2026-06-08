-- SQL Hotfix for submit_recipe_proof variable shadowing error
-- This script fixes the 'record "r" is not assigned yet' runtime error by renaming the table alias 'recipes r' to 'recipes rec'

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
        inner join recipes rec on rec.id = rp.recipe_id
        where rp.source = p_source and rec.status in ('verified', 'legacy_verified');
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
                    corrected_fields = changes,
                    verification_level = 3 -- Correction from print upgrades verification to Level 3
                where id = best_recipe_id;

                insert into recipe_proofs (recipe_id, parsed_name, parsed_skill, parsed_cooker, parsed_container, parsed_mandatory, source, ip_hash, proof_type, corrected_fields)
                values (best_recipe_id, p_name, p_skill, p_cooker, p_container, p_mandatory, p_source, hashed_ip, 'correction', changes);

                return jsonb_build_object('success', true, 'result', 'corrected', 'recipe_id', best_recipe_id);
            else
                -- Just confirms existing verified data
                insert into recipe_proofs (recipe_id, parsed_name, parsed_skill, parsed_cooker, parsed_container, parsed_mandatory, source, ip_hash, proof_type)
                values (best_recipe_id, p_name, p_skill, p_cooker, p_container, p_mandatory, p_source, hashed_ip, 'confirmation');

                -- Confirming an existing verified recipe elevates it to Level 3 (multiple proofs)
                update recipes 
                set verification_level = 3
                where id = best_recipe_id;

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
                    set status = 'verified',
                        verification_level = 3 -- Promote directly to Level 3 (multi-print confirmed)
                    where id = best_recipe_id;

                    insert into recipe_proofs (recipe_id, parsed_name, parsed_skill, parsed_cooker, parsed_container, parsed_mandatory, source, ip_hash, proof_type)
                    values (best_recipe_id, p_name, p_skill, p_cooker, p_container, p_mandatory, p_source, hashed_ip, 'confirmation');

                    return jsonb_build_object('success', true, 'result', 'auto_verified', 'recipe_id', best_recipe_id);
                else
                    -- Same contributor/IP, just log the confirmation proof
                    insert into recipe_proofs (recipe_id, parsed_name, parsed_skill, parsed_cooker, parsed_container, parsed_mandatory, source, ip_hash, proof_type)
                    values (best_recipe_id, p_name, p_skill, p_cooker, p_container, p_mandatory, p_source, hashed_ip, 'confirmation');

                    -- First confirmation logs it as Level 2 (1 print confirmed)
                    update recipes 
                    set verification_level = 2
                    where id = best_recipe_id;

                    return jsonb_build_object('success', true, 'result', 'proof_recorded', 'recipe_id', best_recipe_id);
                end if;
            end;
        end if;

    else
        -- F. Create a new recipe entry (no match found above 75%)
        declare
            target_status text := 'pending';
            target_level int := 0;
        begin
            if is_trusted or p_is_unique then
                target_status := 'verified';
                target_level := 2;
                if p_is_unique then
                    target_level := 3; -- Unique recipes are trusted level 3
                end if;
            end if;

            insert into recipes (name, skill, cooker, container, mandatory, status, is_unique, creator_name, server_name, hint_en, hint_pt, hint_ru, verification_level)
            values (p_name, p_skill, p_cooker, p_container, p_mandatory, target_status, p_is_unique, p_creator_name, p_server_name, p_hint_en, p_hint_pt, p_hint_ru, target_level)
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
