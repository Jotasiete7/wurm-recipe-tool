-- SUPER DEBUG: Listar TODAS as dependências da tabela recipes
-- Rode isso e me mostre o resultado. Vai revelar quem é o culpado.
SELECT conname AS constraint_name,
    conrelid::regclass AS table_name,
    confrelid::regclass AS referenced_table,
    CASE
        confdeltype
        WHEN 'a' THEN 'NO ACTION (Bloqueia Delete)'
        WHEN 'r' THEN 'RESTRICT (Bloqueia Delete)'
        WHEN 'c' THEN 'CASCADE (Permite Delete)'
        WHEN 'n' THEN 'SET NULL'
        WHEN 'd' THEN 'SET DEFAULT'
    END AS delete_rule
FROM pg_constraint
WHERE confrelid = 'recipes'::regclass;