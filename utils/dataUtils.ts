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

export function parseCSV(): Recipe[] {
  const lines = RAW_CSV_DATA.trim().split('\n');
  const data: Recipe[] = [];

  // Skip header (index 0)
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');

    if (values.length >= 1) {
      data.push({
        name: values[0]?.trim() || '',
        skill: normalizeTerm(values[1]),
        container: normalizeTerm(values[2]),
        cooker: normalizeTerm(values[3]),
        mandatory: values[4]?.trim() || '' // Ingredients stay as is (English)
      });
    }
  }

  return data.filter(r => r.name);
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
