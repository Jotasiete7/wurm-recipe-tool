import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gzhvqprdrtudyokhgxlj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6aHZxcHJkcnR1ZHlva2hneGxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3NTQ2MTUsImV4cCI6MjA4MzMzMDYxNX0.aSJIhfViQsb0dBjb5bOup49GCrQBt93uSkZySZAXcNo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testStorage() {
    console.log('🔍 Testing Supabase Storage...');
    
    // 1. List Buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
        console.error('❌ Error listing buckets:', bucketsError);
        return;
    }
    
    console.log('📂 Available Buckets:', buckets);
    
    const imagesBucket = buckets.find(b => b.id === 'images');
    if (!imagesBucket) {
        console.log('❌ "images" bucket is MISSING!');
    } else {
        console.log('✅ "images" bucket is present!', imagesBucket);
    }
}

testStorage();
