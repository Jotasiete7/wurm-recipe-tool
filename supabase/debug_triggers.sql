-- DEBUG TRIGGERS
-- Verifica se existem gatilhos ocultos que rodam ao deletar receitas
SELECT event_object_table AS table_name,
    trigger_name,
    event_manipulation AS event,
    action_timing AS timing,
    action_statement AS statement
FROM information_schema.triggers
WHERE event_object_table IN (
        'recipes',
        'recipe_audit_log',
        'recipes_audit_log'
    );