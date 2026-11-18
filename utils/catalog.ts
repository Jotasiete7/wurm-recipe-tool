import rawRecipes from '../recipes_db.json';
import { IngredientGroup, Recipe, RecipePart } from '../types';

interface RawPart {
  id?: string;
  cstate?: string;
  pstate?: string;
  material?: string;
  realtemplate?: string;
  ratio?: number;
  amount?: number;
  list?: RawPart[];
}

interface RawRecipe {
  name: string;
  recipeid: string;
  skill?: string;
  trigger?: string;
  active?: RawPart;
  target?: RawPart;
  containers?: RawPart[];
  cookers?: RawPart[];
  ingredients?: Record<string, RawPart[]>;
  result?: {
    difficulty?: number | string;
    description?: string;
    name?: string;
  };
  origin?: {
    source?: string;
    is_unique?: boolean;
    creator_name?: string;
  };
}

const GROUP_ORDER = ['mandatory', 'optional', 'oneormore', 'oneof', 'any', 'zeroorone'];

export function formatRecipePart(part: RecipePart | RawPart): string {
  if ('list' in part && part.list?.length) {
    return part.list.map(formatRecipePart).filter(Boolean).join(' | ');
  }
  if (!part.id) return '';
  const bits: string[] = [];
  if (typeof part.amount === 'number') bits.push(`${part.amount}x`);
  if (part.cstate) bits.push(part.cstate);
  if (part.pstate && part.pstate !== 'none') bits.push(part.pstate);
  bits.push(part.id);
  if (part.material) bits.push(`(${part.material})`);
  if (part.realtemplate) bits.push(`[${part.realtemplate}]`);
  if (typeof part.ratio === 'number' && part.ratio > 0) bits.push(`${part.ratio}%`);
  return bits.join(' ');
}

function toPart(part: RawPart): RecipePart | undefined {
  if (!part.id) return undefined;
  return {
    id: part.id,
    cstate: part.cstate,
    pstate: part.pstate,
    material: part.material,
    realtemplate: part.realtemplate,
    ratio: part.ratio,
    amount: part.amount,
  };
}

function mapRecipe(raw: RawRecipe): Recipe {
  const containers = (raw.containers || []).map(item => item.id).filter((id): id is string => Boolean(id));
  const cookers = (raw.cookers || []).map(item => item.id).filter((id): id is string => Boolean(id));
  const groups: IngredientGroup[] = [];
  const ingredients = raw.ingredients || {};
  const keys = [...GROUP_ORDER, ...Object.keys(ingredients).filter(key => !GROUP_ORDER.includes(key))];

  for (const key of keys) {
    const list = ingredients[key];
    if (!list?.length) continue;
    const items = list.map(formatRecipePart).filter(Boolean);
    if (items.length) groups.push({ key, items });
  }

  const difficulty = typeof raw.result?.difficulty === 'number' ? raw.result.difficulty : undefined;

  return {
    id: String(raw.recipeid),
    name: raw.name,
    skill: raw.skill || '',
    container: containers.join(', '),
    cooker: cookers.join(', '),
    mandatory: groups.find(group => group.key === 'mandatory')?.items.join('; ') || '',
    difficulty,
    trigger: raw.trigger,
    active: raw.active ? toPart(raw.active) : undefined,
    target: raw.target ? toPart(raw.target) : undefined,
    ingredientGroups: groups,
    description: raw.result?.description,
    is_unique: raw.origin?.is_unique,
    creator_name: raw.origin?.creator_name,
    source: raw.origin?.source,
  };
}

const catalog: Recipe[] = (rawRecipes as RawRecipe[]).map(mapRecipe).sort((a, b) => a.name.localeCompare(b.name));

const byName = new Map<string, Recipe>();
for (const recipe of catalog) {
  const key = recipe.name.toLowerCase();
  if (!byName.has(key)) byName.set(key, recipe);
}

export function getCatalog(): Recipe[] {
  return catalog;
}

export function findCatalogRecipe(name: string): Recipe | undefined {
  return byName.get(name.trim().toLowerCase());
}

export function catalogNames(): Set<string> {
  return new Set(catalog.map(recipe => recipe.name.toLowerCase()));
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

export function catalogOptions() {
  return {
    skills: unique(catalog.map(recipe => recipe.skill)),
    containers: unique(catalog.flatMap(recipe => recipe.container.split(', '))),
    cookers: unique(catalog.flatMap(recipe => recipe.cooker.split(', '))),
  };
}

export interface CatalogQuery {
  searchTerm?: string;
  skill?: string;
  container?: string;
  cooker?: string;
  page: number;
  itemsPerPage: number;
}

function haystack(recipe: Recipe): string {
  const groups = (recipe.ingredientGroups || []).flatMap(group => group.items);
  return [
    recipe.name,
    recipe.skill,
    recipe.container,
    recipe.cooker,
    recipe.trigger,
    recipe.description,
    recipe.active ? formatRecipePart(recipe.active) : '',
    recipe.target ? formatRecipePart(recipe.target) : '',
    ...groups,
  ].join(' ').toLowerCase();
}

function hasId(joined: string, id: string): boolean {
  if (!id) return true;
  return joined.split(', ').includes(id);
}

export function queryCatalog(query: CatalogQuery): { items: Recipe[]; total: number } {
  const search = (query.searchTerm || '').trim().toLowerCase();
  const matched = catalog.filter(recipe => {
    if (query.skill && recipe.skill.toLowerCase() !== query.skill.toLowerCase()) return false;
    if (!hasId(recipe.container, query.container || '')) return false;
    if (!hasId(recipe.cooker, query.cooker || '')) return false;
    if (search && !haystack(recipe).includes(search)) return false;
    return true;
  });
  const start = query.page * query.itemsPerPage;
  return {
    items: matched.slice(start, start + query.itemsPerPage),
    total: matched.length,
  };
}
