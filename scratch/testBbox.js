import { createWorker } from 'tesseract.js';
import path from 'path';

const brainDir = 'C:\\Users\\Pichau\\.gemini\\antigravity\\brain\\3def090c-0a9d-4848-bda4-84dc69269926';
const imgPath = path.join(brainDir, 'media__1780922897622.png');

async function testBbox() {
  console.log('Initializing worker...');
  const worker = await createWorker('eng');
  try {
    console.log('Running OCR recognition via worker...');
    const { data } = await worker.recognize(imgPath);
    console.log('Array.isArray(data.blocks):', Array.isArray(data.blocks));
    if (data.blocks) {
      console.log(`Found ${data.blocks.length} blocks.`);
      let lineCount = 0;
      data.blocks.forEach((block, bIdx) => {
        if (block.paragraphs) {
          block.paragraphs.forEach((p, pIdx) => {
            if (p.lines) {
              p.lines.forEach((line, lIdx) => {
                lineCount++;
                console.log(`Line ${lineCount.toString().padStart(2)}: x0=${line.bbox.x0.toString().padStart(4)} | text="${line.text.trim()}"`);
              });
            }
          });
        }
      });
    }
  } catch (err) {
    console.error(err);
  } finally {
    await worker.terminate();
  }
}

testBbox();
