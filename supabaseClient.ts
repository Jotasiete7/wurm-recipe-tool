/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// Hardcoded fallback for production stability
const FALLBACK_URL = 'https://gzhvqprdrtudyokhgxlj.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6aHZxcHJkcnR1ZHlva2hneGxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3NTQ2MTUsImV4cCI6MjA4MzMzMDYxNX0.aSJIhfViQsb0dBjb5bOup49GCrQBt93uSkZySZAXcNo';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_KEY;

let client;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('CRITICAL: Missing Supabase URL or Anon Key. Using fallback mock client.');

    // Create a dummy proxy that logs errors on any property access but doesn't crash on init
    const handler = {
        get: function (_target: any, prop: string) {
            if (prop === 'then') return undefined; // Avoid Promise behavior

            // Mock auth namespace
            if (prop === 'auth') {
                return {
                    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
                    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
                    signOut: () => Promise.resolve({ error: null }),
                };
            }

            // Mock from() for DB queries
            if (prop === 'from') {
                return () => ({
                    select: () => ({
                        in: () => ({
                            order: () => ({
                                range: () => Promise.resolve({ data: [], error: { message: 'Missing Configuration' } })
                            })
                        }),
                        eq: () => Promise.resolve({ data: null, error: null }),
                        single: () => Promise.resolve({ data: null, error: null }),
                    })
                });
            }

            return (..._args: any[]) => {
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
export const isFallbackClient = !supabaseUrl || !supabaseAnonKey || (supabaseUrl === FALLBACK_URL);
