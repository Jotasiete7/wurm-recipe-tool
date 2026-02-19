-- Script para corrigir constraints de deleção e logs
-- Execute isto no SQL Editor do Supabase para corrigir o erro de deleção de receitas
-- 1. Tabela recipe_audit_log (singular) - Adiciona ON DELETE CASCADE
DO $$ BEGIN IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
        AND table_name = 'recipe_audit_log'
) THEN -- Remove constraint antiga se existir
ALTER TABLE recipe_audit_log DROP CONSTRAINT IF EXISTS recipe_audit_log_recipe_id_fkey;
-- Adiciona nova constraint com CASCADE
ALTER TABLE recipe_audit_log
ADD CONSTRAINT recipe_audit_log_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE;
RAISE NOTICE 'Constraint corrigida na tabela recipe_audit_log (singular)';
END IF;
END $$;
-- 2. Tabela recipes_audit_log (plural) - Caso exista, corrige também
DO $$ BEGIN IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
        AND table_name = 'recipes_audit_log'
) THEN -- Remove constraint antiga se existir
ALTER TABLE recipes_audit_log DROP CONSTRAINT IF EXISTS recipes_audit_log_recipe_id_fkey;
-- Adiciona nova constraint com CASCADE
ALTER TABLE recipes_audit_log
ADD CONSTRAINT recipes_audit_log_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE;
RAISE NOTICE 'Constraint corrigida na tabela recipes_audit_log (plural)';
END IF;
END $$;