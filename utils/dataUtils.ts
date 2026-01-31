import { Recipe } from '../types';
import { EMOJI_MAP } from '../constants';

// Mapping from Portuguese/Mixed CSV values to Standard English
// This ensures Containers/Recipients are always English (per user request)
// And Skills are standardized to English so we can translate them dynamically later
const NORMALIZATION_MAP: Record<string, string> = {
  // Skills
  'Bebidas': 'Beverages',
  'Cozinha': 'Cooking',
  'Panificação': 'Baking',
  'Hot Food Cooking': 'Hot Food Cooking', // Already EN
  'Laticínios': 'Dairy Food Making',
  'Moagem': 'Milling',

  // Containers / Cookers (Recipients)
  'Caldeirão': 'Cauldron',
  'Pedra de Assar': 'Baking Stone',
  'Frigideira': 'Frying Pan',
  'Forma de Bolo': 'Cake Tin',
  'Forma de Torta': 'Pie Dish',
  'Tigela': 'Pottery Bowl',
  'Prato Madeira': 'Wooden Plate',
  'Tripa': 'Gut',
  'Assadeira': 'Roasting Dish',
  'Panela': 'Saucepan',
  'Jarra': 'Pottery Jar',
  'Barril Vinho': 'Wine Barrel',
  'Cogumelos': 'Mushroom',
  'Forno Aberto': 'Open Oven'
};

function normalizeTerm(term: string): string {
  if (!term) return '';
  const trimmed = term.trim();
  return NORMALIZATION_MAP[trimmed] || trimmed;
}

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
