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

// Helper to find the best matching recipe name within an ingredient string
// e.g. "2x Iron Lump" -> matches "Iron lump" (if it exists)
export function findRecipeMatch(ingredient: string, allRecipeNames: Set<string>): string | null {
  const normIngredient = ingredient.toLowerCase();

  // 1. Exact match check
  if (allRecipeNames.has(normIngredient)) return normIngredient;

  // 2. Substring match
  // We look for the LONGEST recipe name that appears inside the ingredient string
  // This prevents "apple" from matching "apple pie" if "apple pie" is also a recipe
  let bestMatch = '';

  for (const name of allRecipeNames) {
    const normName = name.toLowerCase();
    // Check if the recipe name is part of the ingredient
    if (normIngredient.includes(normName)) {
      // Keep the longest match found so far
      if (normName.length > bestMatch.length) {
        bestMatch = normName;
      }
    }
  }

  return bestMatch || null;
}

export function getUniqueValues(recipes: Recipe[], key: keyof Recipe): string[] {
  const values = new Set<string>();
  recipes.forEach(r => {
    if (r[key]) {
      values.add(r[key] as string);
    }
  });
  return Array.from(values).sort();
}
