-- Helper Script for Wurm Recipes Tool
-- Run this in Supabase SQL Editor if 'recipes' table does not exist
create table if not exists recipes (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    skill text,
    container text,
    cooker text,
    mandatory text,
    -- Stores ingredients string
    difficulty int,
    -- Workflow columns
    status text default 'pending',
    -- pending, verified, rejected
    submitted_by uuid references auth.users,
    screenshot_url text,
    created_at timestamptz default now()
);
-- RLS Policies
alter table recipes enable row level security;
-- 1. Public Read (Verified recipes only)
create policy "Public read verified recipes" on recipes for
select using (status = 'verified');
-- 2. Authenticated Insert (Submit recipes)
create policy "Authenticated submit recipes" on recipes for
insert to authenticated with check (true);
-- 3. Admin Manage (Approve/Reject)
-- Assuming 'profiles' table has global_role
-- Note: RLS using joins can be complex. 
-- Simple version: Allow if user is superadmin or admin in profiles
create policy "Admins manage recipes" on recipes for all using (
    auth.uid() in (
        select id
        from profiles
        where global_role in ('superadmin', 'admin')
    )
);