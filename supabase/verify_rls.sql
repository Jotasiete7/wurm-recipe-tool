-- RLS Verification Script for Wurm Recipes
-- Run this in Supabase SQL Editor to verify security policies
-- 1. Check if RLS is enabled on all tables
SELECT schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
-- 2. List all RLS policies
SELECT schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename,
    policyname;
-- 3. Recommended: Add RLS to profiles table if missing
-- UNCOMMENT AND RUN IF NEEDED:
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- -- Policy: Users can read their own profile
-- CREATE POLICY "Users read own profile" ON profiles
--     FOR SELECT 
--     USING (auth.uid() = id);
-- -- Policy: Admins can read all profiles
-- CREATE POLICY "Admins read all profiles" ON profiles
--     FOR SELECT 
--     USING (
--         auth.uid() IN (
--             SELECT id FROM profiles 
--             WHERE global_role IN ('admin', 'superadmin')
--         )
--     );
-- -- Policy: Users can update their own profile
-- CREATE POLICY "Users update own profile" ON profiles
--     FOR UPDATE
--     USING (auth.uid() = id)
--     WITH CHECK (auth.uid() = id);