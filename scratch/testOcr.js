import Tesseract from 'tesseract.js';
import fs from 'fs';
import path from 'path';

const brainDir = 'C:\\Users\\Pichau\\.gemini\\antigravity\\brain\\3def090c-0a9d-4848-bda4-84dc69269926';

// List of test images restored from previous session
const images = [
  'media__1780920806747.png',
  'media__1780922818162.png',
  'media__1780922897622.png',
  'media__1780923819746.jpg',
  'media__1780923974986.png',
  'media__1780923995093.png',
  'media__1780924545475.png'
];

async function runOCR() {
  console.log('Starting OCR prototype testing...');
  for (const imgName of images) {
    const imgPath = path.join(brainDir, imgName);
    if (!fs.existsSync(imgPath)) {
      console.log(`File not found: ${imgPath}`);
      continue;
    }

    console.log(`\n==================================================`);
    console.log(`Processing: ${imgName}`);
    console.log(`==================================================`);

    try {
      const { data: { text } } = await Tesseract.recognize(imgPath, 'eng');
      console.log('--- RAW OCR TEXT ---');
      console.log(text);
    } catch (error) {
      console.error(`Error processing ${imgName}:`, error);
    }
  }
}

runOCR();
