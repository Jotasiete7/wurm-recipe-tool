-- LER FUNÇÃO DO TRIGGER
-- Vamos ver o código que está causando o erro
SELECT pg_get_functiondef(oid)
FROM pg_proc
WHERE proname = 'log_recipe_changes';