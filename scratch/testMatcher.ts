import fs from 'fs';
import path from 'path';
import { findBestRecipeMatch, calculateRecipeSimilarity } from '../utils/recipeMatcher.ts';
import { Recipe } from '../types.ts';

// Load mock recipe DB from backup JSON
const backupPath = 'C:\\Users\\Pichau\\ecosystem\\recipes\\backup_legacy_recipes.json';
const dbRecipesRaw = JSON.parse(fs.readFileSync(backupPath, 'utf8')).recipes;
const dbRecipes: Recipe[] = dbRecipesRaw.map((r: any) => ({
  name: r.name,
  skill: r.skill || '',
  container: r.container || '',
  cooker: r.cooker || '',
  mandatory: r.mandatory || ''
}));

const mockParsedRecipes = [
  {
    desc: 'Perfect Match (with prefix cleaning)',
    parsed: {
      name: 'E15 pork belly rillons',
      skill: 'hot food cooking',
      cooker: 'forge; oven',
      container: 'cauldron',
      mandatory: 'raw any meat (pork); fat; chopped rosemary; any raw garlic; red wine; raw+mashed potato'
    },
    expectedName: 'pork belly rillons'
  },
  {
    desc: 'OCR Typo in Name and Reordered Ingredients',
    parsed: {
      name: 'Dilly SNeep grufi stew',
      skill: 'hot food cooking',
      cooker: 'campfire',
      container: 'open helm',
      mandatory: 'chopped potato; chopped tomato; raw any meat (lamb); moonshine; chopped belladonna; chopped carrot'
    },
    expectedName: 'billy sheep gruff stew'
  },
  {
    desc: 'Goblin Liver with vertical bar border artifacts',
    parsed: {
      name: 'goblin liver and onion',
      skill: 'hot food cooking',
      cooker: '',
      container: 'cauldron',
      mandatory: 'gland; chopped onion I; salt; any cooking oi'
    },
    expectedName: 'goblin liver and onion'
  }
];

function runTest() {
  console.log('Running Recipe Matcher Unit Tests...');
  let passed = 0;

  for (const tc of mockParsedRecipes) {
    console.log(`\nCase: ${tc.desc}`);
    console.log(`Parsed Name: "${tc.parsed.name}"`);
    
    // Debug specific candidate for Case 2
    if (tc.parsed.name === 'Dilly SNeep grufi stew') {
      const candidate = dbRecipes.find(r => r.name.toLowerCase() === 'billy sheep gruff stew');
      if (candidate) {
        const score = calculateRecipeSimilarity(tc.parsed, candidate);
        console.log(`DEBUG: Similarity with "billy sheep gruff stew" = ${(score * 100).toFixed(1)}%`);
      }
    }

    const match = findBestRecipeMatch(tc.parsed, dbRecipes, 0.5);
    if (match) {
      console.log(`-> Found match: "${match.recipe.name}" (Score: ${(match.score * 100).toFixed(1)}%)`);
      if (match.recipe.name.toLowerCase() === tc.expectedName.toLowerCase()) {
        console.log('✅ PASS');
        passed++;
      } else {
        console.log(`❌ FAIL (expected "${tc.expectedName}")`);
      }
    } else {
      console.log('❌ FAIL (No match found)');
    }
  }

  console.log(`\nResult: ${passed}/${mockParsedRecipes.length} tests passed.`);
}

runTest();
