-- SQL Migration to separate verification votes from recipe likes

-- 1. Add is_like column to recipe_votes
alter table recipe_votes add column if not exists is_like boolean default true;

-- 2. Re-create top_recipes_monthly view to only count votes with is_like = true
create or replace view top_recipes_monthly as
select
    r.id, r.name, r.skill, r.status,
    count(v.id) as vote_count
from recipes r
left join recipe_votes v
  on v.recipe_id = r.id
  and v.is_like = true
  and date_trunc('month', v.voted_at) = date_trunc('month', now())
where r.status in ('verified', 'legacy_verified')
group by r.id, r.name, r.skill, r.status
order by vote_count desc
limit 10;

-- 3. Update vote_recipe RPC function to handle pending confirmations and prevent self-confirmations
create or replace function vote_recipe(p_recipe_id uuid)
returns jsonb
security definer
as $$
declare
    client_ip text;
    hashed_ip text;
    vote_exists boolean;
    r_status text;
    submitter_ip text;
begin
    client_ip := coalesce(current_setting('request.headers', true)::json->>'x-forwarded-for', '127.0.0.1');
    hashed_ip := encode(digest(client_ip, 'sha256'), 'hex');

    -- Get recipe status
    select status into r_status 
    from recipes 
    where id = p_recipe_id;

    if r_status is null then
        return jsonb_build_object('success', false, 'message', 'recipe_not_found');
    end if;

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

    if r_status = 'pending' then
        -- Retrieve submitter IP to prevent self-verification
        select ip_hash into submitter_ip 
        from recipe_proofs 
        where recipe_id = p_recipe_id 
        order by created_at asc 
        limit 1;

        if hashed_ip = submitter_ip then
            return jsonb_build_object('success', false, 'message', 'cannot_confirm_own_recipe');
        end if;

        -- Record verification vote (is_like = false)
        insert into recipe_votes (recipe_id, ip_hash, is_like)
        values (p_recipe_id, hashed_ip, false);

        -- Promote pending recipe to verified (Level 2)
        update recipes
        set status = 'verified',
            verification_level = 2
        where id = p_recipe_id;

        return jsonb_build_object('success', true, 'message', 'recipe_confirmed');
    else
        -- Record recipe like (is_like = true)
        insert into recipe_votes (recipe_id, ip_hash, is_like)
        values (p_recipe_id, hashed_ip, true);

        -- Upgrade verified/legacy_verified recipes to level 3 when they receive votes
        update recipes
        set verification_level = 3
        where id = p_recipe_id;

        return jsonb_build_object('success', true, 'message', 'vote_recorded');
    end if;

exception
    when others then
        return jsonb_build_object('success', false, 'message', SQLERRM);
end;
$$ language plpgsql;
