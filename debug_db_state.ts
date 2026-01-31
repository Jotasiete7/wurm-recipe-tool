import { createClient } from '@supabase/supabase-js';

// Credentials from migrate_recipes.ts
const supabaseUrl = 'https://gzhvqprdrtudyokhgxlj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6aHZxcHJkcnR1ZHlva2hneGxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3NTQ2MTUsImV4cCI6MjA4MzMzMDYxNX0.aSJIhfViQsb0dBjb5bOup49GCrQBt93uSkZySZAXcNo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugDB() {
    console.log('🔍 Debugging Recipes DB State...');

    // 1. Get Totals
    const { count, error: countError } = await supabase
        .from('recipes')
        .select('*', { count: 'exact', head: true });

    if (countError) console.error('Count Error:', countError);
    console.log(`Total Rows in DB: ${count}`);

    // 2. Get Distribution by Status
    // We remove 'id' from select to just trigger the fetch, but selecting columns helps debug
    const { data: allRecipes, error: fetchError } = await supabase
        .from('recipes')
        .select('name, status, source, legacy_key');

    if (fetchError) {
        console.error('Fetch Error:', fetchError);
        return;
    }

    const statusCounts: Record<string, number> = {};
    allRecipes?.forEach(r => {
        const s = r.status || 'NULL';
        statusCounts[s] = (statusCounts[s] || 0) + 1;
    });

    console.log('\n📊 Status Distribution:', statusCounts);

    // 3. Sample
    if (allRecipes && allRecipes.length > 0) {
        console.log('\n📝 Sample Recipe:', allRecipes[0]);
    } else {
        console.log('\n⚠️ No recipes returned by query (Check RLS if using Anon Key)');
    }
}

debugDB();
