const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gzhvqprdrtudyokhgxlj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6aHZxcHJkcnR1ZHlva2hneGxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3NTQ2MTUsImV4cCI6MjA4MzMzMDYxNX0.aSJIhfViQsb0dBjb5bOup49GCrQBt93uSkZySZAXcNo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSubmit() {
    console.log('Calling submit_recipe_proof RPC...');
    
    const startTime = Date.now();
    try {
        const { data, error } = await supabase.rpc('submit_recipe_proof', {
            p_name: 'test recipe name',
            p_skill: 'Cooking',
            p_cooker: 'None',
            p_container: 'None',
            p_mandatory: 'chopped tomato; moonshine; chopped belladonna; chopped carrot; chopped potato',
            p_source: 'jotasiete',
            p_is_unique: false,
            p_creator_name: null,
            p_server_name: null,
            p_hint_en: null,
            p_hint_pt: null,
            p_hint_ru: null
        });

        console.log(`Finished in ${Date.now() - startTime}ms`);
        if (error) {
            console.error('RPC Error:', error);
        } else {
            console.log('RPC Response Data:', data);
        }
    } catch (e) {
        console.error('Caught exception:', e);
    }
}

testSubmit();
