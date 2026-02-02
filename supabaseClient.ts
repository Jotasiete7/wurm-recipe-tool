/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let client;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('CRITICAL: Missing Supabase URL or Anon Key. Using fallback mock client.');

    // Create a dummy proxy that logs errors on any property access but doesn't crash on init
    const handler = {
        get: function (target: any, prop: string) {
            if (prop === 'then') return undefined; // Avoid Promise behavior
            return (...args: any[]) => {
                console.error(`Supabase client called without configuration (method: ${prop})`);
                return { data: null, error: { message: 'Missing Supabase Configuration' } }; // Mock response
            };
        }
    };
    client = new Proxy({}, handler);
} else {
    client = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = client;
