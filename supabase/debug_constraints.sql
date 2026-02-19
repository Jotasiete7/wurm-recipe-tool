-- Script diagnóstico para listar quem aponta para 'recipes'
-- Rode isso e veja o resultado (output)
SELECT conname AS constraint,
    conrelid::regclass AS table_name,
    CASE
        confdeltype
        WHEN 'a' THEN 'NO ACTION'
        WHEN 'r' THEN 'RESTRICT'
        WHEN 'c' THEN 'CASCADE (OK)'
        WHEN 'n' THEN 'SET NULL'
        WHEN 'd' THEN 'SET DEFAULT'
    END AS delete_rule
FROM pg_constraint
WHERE confrelid = 'recipes'::regclass;