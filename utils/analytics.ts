import { supabase } from '../supabaseClient';
import { UsageStats } from '../types';

export async function fetchUsageStats(): Promise<UsageStats | null> {
    try {
        const { data, error } = await supabase.rpc('get_db_stats');

        if (error) {
            console.error('Error fetching usage stats:', error);
            return null;
        }

        return data as UsageStats;
    } catch (err) {
        console.error('Unexpected error fetching stats:', err);
        return null;
    }
}
