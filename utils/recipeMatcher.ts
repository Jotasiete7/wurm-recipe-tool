import { Recipe } from '../types';

// Calculate Levenshtein distance between two strings
export function levenshteinDistance(a: string, b: string): number {
  const tmp = [];
  let i, j, alen = a.length, blen = b.length;
  if (alen === 0) return blen;
  if (blen === 0) return alen;
  for (i = 0; i <= alen; i++) tmp[i] = [i];
  for (j = 0; j <= blen; j++) tmp[0][j] = j;
  for (i = 1; i <= alen; i++) {
    for (j = 1; j <= blen; j++) {
      tmp[i][j] = Math.min(
        tmp[i - 1][j] + 1,
        tmp[i][j - 1] + 1,
        tmp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return tmp[alen][blen];
}

// Get string similarity score between 0 and 1
export function getStringSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().replace(/\s+/g, ' ').trim();
  const s2 = str2.toLowerCase().replace(/\s+/g, ' ').trim();
  if (s1 === s2) return 1;
  if (!s1 || !s2) return 0;
  
  const dist = levenshteinDistance(s1, s2);
  const maxLen = Math.max(s1.length, s2.length);
  return 1 - dist / maxLen;
}

// Normalize ingredient name for matching
export function normalizeIngredient(ing: string): string {
  return ing
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Tokenize a string into set of words
export function getTokens(str: string): string[] {
  return str.split(' ').filter(t => t.length > 0);
}

// Calculate similarity between two ingredients (fuzzy token match)
export function getIngredientSimilarity(ing1: string, ing2: string): number {
  const i1 = normalizeIngredient(ing1);
  const i2 = normalizeIngredient(ing2);
  if (i1 === i2) return 1.0;
  if (i1.includes(i2) || i2.includes(i1)) return 0.9; // substring match

  // Token Jaccard overlap
  const t1 = getTokens(i1);
  const t2 = getTokens(i2);
  if (t1.length === 0 || t2.length === 0) return 0;
  
  const set1 = new Set(t1);
  const set2 = new Set(t2);
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}

/**
 * Calculates a similarity score between a parsed recipe and a database recipe.
 * Score is between 0 and 1.
 */
export function calculateRecipeSimilarity(parsed: Partial<Recipe>, dbRecipe: Recipe): number {
  // 1. Name similarity (Weight: 50% - name is key)
  const nameScore = getStringSimilarity(parsed.name || '', dbRecipe.name);

  // 2. Ingredients similarity (Weight: 50% - ingredients are key)
  const parsedIngs = (parsed.mandatory || '')
    .split(';')
    .map(i => i.trim())
    .filter(i => i.length > 0);
    
  const dbIngs = (dbRecipe.mandatory || '')
    .split(';')
    .map(i => i.trim())
    .filter(i => i.length > 0);

  if (parsedIngs.length === 0 && dbIngs.length === 0) {
    return nameScore;
  }

  // Find best match for each ingredient to handle typos, order, and extra details (like Qty)
  let totalMatchScore = 0;
  const matchedDbIndices = new Set<number>();

  for (const parsedIng of parsedIngs) {
    let bestIngScore = 0;
    let bestDbIdx = -1;

    for (let j = 0; j < dbIngs.length; j++) {
      if (matchedDbIndices.has(j)) continue;
      const score = getIngredientSimilarity(parsedIng, dbIngs[j]);
      if (score > bestIngScore) {
        bestIngScore = score;
        bestDbIdx = j;
      }
    }

    if (bestIngScore >= 0.5) { // Match threshold
      totalMatchScore += bestIngScore;
      if (bestDbIdx !== -1) {
        matchedDbIndices.add(bestDbIdx);
      }
    }
  }

  const maxIngredients = Math.max(parsedIngs.length, dbIngs.length);
  const ingredientsScore = maxIngredients > 0 ? totalMatchScore / maxIngredients : 0;

  // Weighted total score
  const totalScore = (nameScore * 0.5) + (ingredientsScore * 0.5);
  return totalScore;
}

/**
 * Finds the best recipe match from a list of database recipes.
 */
export function findBestRecipeMatch(
  parsed: Partial<Recipe>,
  allRecipes: Recipe[],
  threshold = 0.5
): { recipe: Recipe; score: number } | null {
  let bestMatch: Recipe | null = null;
  let bestScore = 0;

  for (const recipe of allRecipes) {
    const score = calculateRecipeSimilarity(parsed, recipe);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = recipe;
    }
  }

  if (bestScore >= threshold && bestMatch) {
    return { recipe: bestMatch, score: bestScore };
  }

  return null;
}
