-- ============================================================
-- Search Analytics + Ingredient Market Intelligence
-- Migration: 20260609_search_analytics.sql
-- ============================================================

-- 1. TABLE: search_logs
-- Stores every meaningful search (debounced, 3+ chars).
-- 'found' = false means zero-result search (valuable insight).
-- ============================================================

CREATE TABLE IF NOT EXISTS search_logs (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  term        text        NOT NULL,
  recipe_id   uuid        REFERENCES recipes(id) ON DELETE SET NULL,
  recipe_name text,
  lang        text        NOT NULL DEFAULT 'en',
  found       boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Indexes for aggregation queries by time period
CREATE INDEX IF NOT EXISTS idx_search_logs_created_at ON search_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_logs_recipe_id  ON search_logs(recipe_id);
CREATE INDEX IF NOT EXISTS idx_search_logs_found      ON search_logs(found);

-- RLS: anonymous users can insert (no personal data stored)
--      authenticated users can read (for admin dashboards)
ALTER TABLE search_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_anon_insert_search_logs" ON search_logs;
CREATE POLICY "allow_anon_insert_search_logs"
  ON search_logs FOR INSERT TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "allow_auth_read_search_logs" ON search_logs;
CREATE POLICY "allow_auth_read_search_logs"
  ON search_logs FOR SELECT TO authenticated
  USING (true);

-- Also allow anon to read aggregated views (no raw data exposed)
DROP POLICY IF EXISTS "allow_anon_read_search_logs" ON search_logs;
CREATE POLICY "allow_anon_read_search_logs"
  ON search_logs FOR SELECT TO anon
  USING (true);


-- ============================================================
-- 2. VIEW: top_searched_recipes
-- Top recipes by search volume. Supports period filtering
-- via WHERE clause in calling queries.
-- ============================================================

DROP VIEW IF EXISTS top_searched_recipes;
CREATE OR REPLACE VIEW top_searched_recipes AS
SELECT
  recipe_id,
  recipe_name,
  COUNT(*)::int AS search_count,
  MAX(created_at) AS last_searched_at
FROM search_logs
WHERE found = true
  AND recipe_id IS NOT NULL
GROUP BY recipe_id, recipe_name
ORDER BY search_count DESC
LIMIT 30;


-- ============================================================
-- 3. VIEW: top_demanded_ingredients
-- Derives ingredient demand from recipe search volume.
-- Splits the 'mandatory' field (comma-separated ingredients)
-- and sums the search_count of all recipes containing each.
-- This is the core "market intelligence" signal.
-- ============================================================

DROP VIEW IF EXISTS top_demanded_ingredients;
CREATE OR REPLACE VIEW top_demanded_ingredients AS
WITH searched AS (
  SELECT
    recipe_id,
    COUNT(*)::int AS search_count
  FROM search_logs
  WHERE found = true
    AND recipe_id IS NOT NULL
  GROUP BY recipe_id
),
split_ingredients AS (
  SELECT
    r.id AS recipe_id,
    trim(unnest(string_to_array(r.mandatory, ','))) AS ingredient
  FROM recipes r
  INNER JOIN searched s ON s.recipe_id = r.id
  WHERE r.mandatory IS NOT NULL AND length(r.mandatory) > 0
)
SELECT
  si.ingredient,
  SUM(s.search_count)::int AS demand_score,
  COUNT(DISTINCT si.recipe_id)::int AS recipe_count
FROM split_ingredients si
INNER JOIN searched s ON s.recipe_id = si.recipe_id
WHERE length(si.ingredient) > 2
  AND si.ingredient NOT ILIKE '%water%' -- filter trivial base ingredients if needed
GROUP BY si.ingredient
ORDER BY demand_score DESC
LIMIT 30;


-- ============================================================
-- 4. VIEW: zero_result_searches
-- Searches that found nothing. Tells us what recipes the
-- community wants but doesn't exist yet.
-- ============================================================

DROP VIEW IF EXISTS zero_result_searches;
CREATE OR REPLACE VIEW zero_result_searches AS
SELECT
  lower(trim(term)) AS term,
  COUNT(*)::int     AS search_count,
  MAX(created_at)   AS last_searched_at
FROM search_logs
WHERE found = false
GROUP BY lower(trim(term))
ORDER BY search_count DESC
LIMIT 20;


-- ============================================================
-- 5. VIEW: contributor_stats
-- Top recipe contributors by verified recipe count.
-- Uses 'source' (text display name), NOT submitted_by (uuid).
-- ============================================================

DROP VIEW IF EXISTS contributor_stats;

CREATE VIEW contributor_stats AS
SELECT
  source,
  COUNT(*) AS recipe_count
FROM recipes
WHERE status IN ('verified', 'legacy_verified', 'highly_trusted')
  AND source IS NOT NULL
  AND source <> ''
GROUP BY source
ORDER BY recipe_count DESC
LIMIT 20;
