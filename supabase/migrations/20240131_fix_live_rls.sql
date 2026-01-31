-- Fix Public Read Policy to include legacy_verified
drop policy if exists "Public read verified recipes" on recipes;
create policy "Public read verified recipes" on recipes for
select using (status in ('verified', 'legacy_verified'));