export const EMOJI_MAP: Record<string, string> = {
  'bread': '🍞', 'cake': '🍰', 'pie': '🥧', 'soup': '🍲', 'stew': '🍲', 'curry': '🍛',
  'salad': '🥗', 'sandwich': '🥪', 'pizza': '🍕', 'pasta': '🍝', 'rice': '🍚',
  'meat': '🍖', 'fish': '🐟', 'cheese': '🧀', 'egg': '🥚', 'juice': '🧃', 'beer': '🍺',
  'cookie': '🍪', 'ice cream': '🍨', 'bacon': '🥓', 'sausage': '🌭', 'burger': '🍔',
  'toffee': '🍬', 'chocolate': '🍫', 'wine': '🍷', 'tea': '🍵', 'coffee': '☕',
  'popcorn': '🍿', 'pancake': '🥞', 'toast': '🍞', 'jam': '🍯',
  'milk': '🥛', 'cream': '🥛', 'butter': '🧈', 'vodka': '🍸',
  'whisky': '🥃', 'gin': '🍸', 'brandy': '🥃', 'cider': '🍺', 'mead': '🍯',
  'biscuit': '🍪', 'trifle': '🍮', 'porridge': '🥣', 'pudding': '🍮'
};

// Recipe Form Options
export const SKILLS = [
  'Baking',
  'Cooking',
  'Hot food cooking',
  'Butchering',
  'Beverages',
  'Dairy food making'
] as const;

export const CONTAINERS = [
  'None',
  'Bowl',
  'Pottery bowl',
  'Cauldron',
  'Sauce pan',
  'Frying pan',
  'Baking stone',
  'Stone oven',
  'Open Helmet',
  'Wine barrel',
  'Wooden plate',
  'Cake tin',
  'Pie dish',
  'Pottery jar',
  'Gut',
  'Roasting dish',
  'Mushroom'
] as const;

export const COOKERS = [
  'None',
  'Campfire',
  'Stone oven',
  'Kiln',
  'Forge',
  'Open oven'
] as const;

// Legacy Data Removed - Migrated to Supabase (2024-01-31)
// See backup_legacy_recipes.json for original data