import { Recipe } from '../types';

export function cleanOcrPrefix(name: string): string {
  let cleaned = name.trim();
  
  // Strip typical OCR checkbox artifacts at the start:
  // e.g. "A. ", "Hl ", "§ ", "> ", "/ ", "& ", "Ti ® ", "BI + ", "Be / ", "[=~ ", "@ 2 "
  // 1. Strip symbols and single character + symbol/punctuation prefixes:
  cleaned = cleaned.replace(/^[^a-zA-Z0-9\s]*[0-9®+@~=[\]#|»\-&/>§\\•<().]+\s*/g, '');
  // 2. Strip single/double letter + symbol/punctuation prefixes (like "B® + ", "A. ", "Ti ® ", "Hl ", "Be / "):
  cleaned = cleaned.replace(/^[a-zA-Z]{1,2}[®+@~=[\]#|»\-&/>§\\•<().\s]+\s*/g, '');
  // 3. Strip single digits or standalone letters followed by space at the start (like "8 ", "0 ", "7 ", "f "):
  cleaned = cleaned.replace(/^[0-9a-zA-Z]\s+/g, '');
  // 4. Strip any leftover symbols/punctuation at the start:
  cleaned = cleaned.replace(/^[^a-zA-Z0-9\s]+\s*/g, '');
  
  return cleaned.trim();
}

/**
 * Parses raw OCR text output from Tesseract.js into a partial Recipe object.
 */
export function parseOcrText(rawText: string): Partial<Recipe> {
  const lines = rawText.split(/\r?\n/).map(l => l.trim());

  let name = '';
  let skill = '';
  const cookers: string[] = [];
  const containers: string[] = [];
  const ingredients: string[] = [];

  let state: 'before_mandatory' | 'in_cookers' | 'in_containers' | 'in_mandatory' = 'before_mandatory';
  let inSubRecipe = false;

  // List of valid skills for matching (case-insensitive)
  const VALID_SKILLS = [
    'hot food cooking',
    'baking',
    'natural substances',
    'beverages',
    'milling',
    'cooking',
    'dairy food making',
  ];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    
    // Strip trailing vertical lines or trash commonly found at window borders in screenshots
    line = line.replace(/[\s|l/]+$/, '').trim();
    
    const cleaned = cleanOcrPrefix(line);

    // Skip blank or garbage lines
    if (
      line.length < 2 || 
      /cooking recipes/i.test(line) || 
      /search here/i.test(line) || 
      /clear/i.test(line) || 
      /show favourites/i.test(line)
    ) {
      continue;
    }

    // Skip timestamp lines
    if (/\[\d{2}:\d{2}:\d{2}\]/.test(line)) {
      continue;
    }

    // Check if this line is the MAIN recipe's skill anchor
    if (/skill:\s*/i.test(line) && !skill) {
      const parsedSkill = line.split(':')[1]?.trim().toLowerCase().replace(/[\s|l/]+$/, '').trim();
      const cleanSkill = parsedSkill.replace(/[^a-z\s]/g, '').trim();
      
      if (VALID_SKILLS.includes(cleanSkill)) {
        skill = cleanSkill;
        // The line immediately before (if it exists and is clean) is the recipe name!
        if (i > 0) {
          // Look backwards for a non-empty line
          for (let j = i - 1; j >= 0; j--) {
            let prevLine = lines[j].trim().replace(/[\s|l/]+$/, '').trim();
            if (prevLine.length > 2 && !/\[\d{2}:\d{2}:\d{2}\]/.test(prevLine)) {
              name = cleanOcrPrefix(prevLine);
              break;
            }
          }
        }
      }
      continue;
    }

    // State boundaries for the main recipe
    if (/cookers/i.test(line) && state !== 'in_mandatory') {
      state = 'in_cookers';
      continue;
    }
    if (/containers/i.test(line) && state !== 'in_mandatory') {
      state = 'in_containers';
      continue;
    }
    if (/mandatory/i.test(line) || /required ingredients/i.test(line)) {
      state = 'in_mandatory';
      continue;
    }

    // Process based on state
    if (state === 'in_cookers') {
      if (cleaned.length > 2) {
        cookers.push(cleaned);
      }
    } else if (state === 'in_containers') {
      if (cleaned.length > 2) {
        containers.push(cleaned);
      }
    } else if (state === 'in_mandatory') {
      // If we see "Skill:" inside ingredients, it starts a sub-recipe block
      if (/skill:\s*/i.test(line)) {
        inSubRecipe = true;
        continue;
      }

      if (inSubRecipe) {
        // Skip sub-recipe structure keywords
        if (
          /tool:/i.test(line) || 
          /target:/i.test(line) || 
          /active:/i.test(line) ||
          /cookers/i.test(line) || 
          /containers/i.test(line) || 
          /mandatory/i.test(line) || 
          /required ingredients/i.test(line)
        ) {
          // Tool-action sub-recipes end at "Target:"
          if (/target:/i.test(line)) {
            inSubRecipe = false;
          }
          continue;
        }

        // Cooked sub-recipes: we exit if we see a line starting with a clear checkbox prefix
        const startsWithMainPrefix = /^[E|B|H|\[|\]|>|»|~]/i.test(line.trim());
        if (startsWithMainPrefix) {
          inSubRecipe = false;
        } else {
          continue; // Skip the sub-recipe line
        }
      }

      // If we got here, it's a main ingredient!
      if (cleaned.length > 2) {
        if (!ingredients.includes(cleaned)) {
          ingredients.push(cleaned);
        }
      }
    }
  }

  return {
    name: name,
    skill: skill,
    cooker: cookers.join('; '),
    container: containers.join('; '),
    mandatory: ingredients.join('; '),
  };
}

/**
 * Merges two parsed recipes, combining lists and prioritizing non-empty values.
 */
export function mergeParses(a: Partial<Recipe>, b: Partial<Recipe>): Partial<Recipe> {
  const mergeList = (str1: string = '', str2: string = '') => {
    const set = new Set([
      ...str1.split(';').map(x => x.trim()),
      ...str2.split(';').map(x => x.trim())
    ].filter(x => x.length > 0));
    return Array.from(set).join('; ');
  };

  return {
    name: a.name || b.name || '',
    skill: a.skill || b.skill || '',
    cooker: mergeList(a.cooker, b.cooker),
    container: mergeList(a.container, b.container),
    mandatory: mergeList(a.mandatory, b.mandatory),
  };
}
