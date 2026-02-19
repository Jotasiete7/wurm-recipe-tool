-- NUCLEAR FIX: Correção Abrangente de Constraints
-- Este script tenta corrigir TODAS as variações possíveis do problema e recarrega o cache.
BEGIN;
-- 1. Descobrir e dropar constraints na tabela recipe_audit_log (singular)
DO $$
DECLARE r record;
BEGIN FOR r IN (
    SELECT constraint_name
    FROM information_schema.table_constraints
    WHERE table_name = 'recipe_audit_log'
        AND constraint_type = 'FOREIGN KEY'
) LOOP EXECUTE 'ALTER TABLE recipe_audit_log DROP CONSTRAINT ' || r.constraint_name;
RAISE NOTICE 'Dropped constraint: %',
r.constraint_name;
END LOOP;
END $$;
-- 2. Recriar constraint correta (singular) se a tabela existir
DO $$ BEGIN IF EXISTS (
    SELECT
    FROM information_schema.tables
    WHERE table_name = 'recipe_audit_log'
) THEN
ALTER TABLE recipe_audit_log
ADD CONSTRAINT recipe_audit_log_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE;
RAISE NOTICE 'Applied CASCADE to recipe_audit_log';
END IF;
END $$;
-- 3. Descobrir e dropar constraints na tabela recipes_audit_log (plural)
DO $$
DECLARE r record;
BEGIN FOR r IN (
    SELECT constraint_name
    FROM information_schema.table_constraints
    WHERE table_name = 'recipes_audit_log'
        AND constraint_type = 'FOREIGN KEY'
) LOOP EXECUTE 'ALTER TABLE recipes_audit_log DROP CONSTRAINT ' || r.constraint_name;
RAISE NOTICE 'Dropped constraint: %',
r.constraint_name;
END LOOP;
END $$;
-- 4. Recriar constraint correta (plural) se a tabela existir
DO $$ BEGIN IF EXISTS (
    SELECT
    FROM information_schema.tables
    WHERE table_name = 'recipes_audit_log'
) THEN
ALTER TABLE recipes_audit_log
ADD CONSTRAINT recipes_audit_log_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE;
RAISE NOTICE 'Applied CASCADE to recipes_audit_log';
END IF;
END $$;
COMMIT;
-- 5. Forçar recarregamento do Schema Cache do PostgREST
-- Isso corrige erros onde a API ainda "lembra" da regra antiga
NOTIFY pgrst,
'reload schema';