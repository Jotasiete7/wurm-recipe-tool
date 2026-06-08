import Tesseract from 'tesseract.js';
import path from 'path';
import fs from 'fs';
import { parseOcrText } from '../utils/ocrParser.ts';

const brainDir = 'C:\\Users\\Pichau\\.gemini\\antigravity\\brain\\3def090c-0a9d-4848-bda4-84dc69269926';

const testImages = [
  'media__1780922818162.png', // Dilly sheep gruff stew (closed)
  'media__1780922897622.png', // Dilly sheep gruff stew (open sub-recipes)
  'media__1780923819746.jpg', // goblin liver and onion
  'media__1780923974986.png', // pork belly rillons (top cut)
  'media__1780923995093.png'  // pork belly rillons (full body)
];

async function runTest() {
  console.log('Testing OCR Parser against screenshots...');
  for (const imgName of testImages) {
    const imgPath = path.join(brainDir, imgName);
    if (!fs.existsSync(imgPath)) {
      console.log(`Image not found: ${imgName}`);
      continue;
    }

    console.log(`\n----------------------------------------------`);
    console.log(`OCR Scanning image: ${imgName}`);
    console.log(`----------------------------------------------`);

    try {
      const { data: { text } } = await Tesseract.recognize(imgPath, 'eng');
      const parsed = parseOcrText(text);
      console.log('Parsed Recipe Output:');
      console.log(JSON.stringify(parsed, null, 2));
    } catch (err) {
      console.error(`Error processing ${imgName}:`, err);
    }
  }
}

runTest();
