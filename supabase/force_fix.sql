-- Script de correção FORÇADA (sem verificações)
-- Se este script der erro, saberemos exatamente o porquê (ex: tabela não existe)
-- Remove a constraint antiga
ALTER TABLE recipe_audit_log DROP CONSTRAINT IF EXISTS recipe_audit_log_recipe_id_fkey;
-- Adiciona a constraint nova com CASCADE
ALTER TABLE recipe_audit_log
ADD CONSTRAINT recipe_audit_log_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE;
-- Confirmação
SELECT 'Constraint aplicada com sucesso em recipe_audit_log' as status;