import { Recipe } from '../types';
import { EMOJI_MAP } from '../constants';

// Mapping from Portuguese/Mixed CSV values to Standard English
// This ensures Containers/Recipients are always English (per user request)
// And Skills are standardized to English so we can translate them dynamically later


// Normalization map removed as it was unused in this scope


export function getEmoji(name: string): string {
  const l = name.toLowerCase();
  for (const k in EMOJI_MAP) {
    if (l.includes(k)) return EMOJI_MAP[k];
  }
  return '🍴';
}

// parseCSV removed - Legacy data migrated to Supabase

export function getUniqueValues(recipes: Recipe[], key: keyof Recipe): string[] {
  const values = new Set<string>();
  recipes.forEach(r => {
    if (r[key]) {
      values.add(r[key] as string);
    }
  });
  return Array.from(values).sort();
}
