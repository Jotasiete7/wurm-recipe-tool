-- CORREÇÃO DO TRIGGER (A SOLUÇÃO REAL)
-- O problema era que o trigger rodava após o DELETE e tentava criar um log
-- referenciando a receita que acabara de ser excluída (violação e pescadinha de rabo).
-- 1. Remove o trigger antigo (que escutava INSERT, UPDATE e DELETE)
DROP TRIGGER IF EXISTS recipe_audit_trigger ON recipes;
-- 2. Cria o trigger novo (escutando APENAS INSERT e UPDATE)
-- Assim, ao deletar, ele não tenta criar log e deixa o CASCADE fazer o trabalho limpo.
CREATE TRIGGER recipe_audit_trigger
AFTER
INSERT
    OR
UPDATE ON recipes FOR EACH ROW EXECUTE FUNCTION log_recipe_changes();
SELECT 'Trigger corrigido com sucesso! Tente deletar agora.' as status;