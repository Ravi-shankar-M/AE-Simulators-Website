/**
 * AE-Simulators Logo Background Processor - Advanced Version
 * Converts near-black/dark background to pure white (#FFFFFF)
 * while preserving all logo artwork (colored/bright pixels).
 *
 * Strategy: Replace all pixels with luminance below a threshold with white.
 * This works because the background is near-black (0,0,0) and the
 * logo artwork is colored (reds, whites, grays, etc.)
 */

import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

const INPUT_PATH = resolve(projectRoot, 'public/logo/ae-automation-engineers-original.png');
const OUTPUT_PATH = resolve(projectRoot, 'public/logo/ae-automation-engineers.png');

// Threshold for "background-like" darkness (0-255)
// Pixels darker than this in all RGB channels are treated as background
const DARK_THRESHOLD = 25;

async function processLogo() {
  console.log('Processing logo with dark-to-white background replacement...');
  
  const { data, info } = await sharp(INPUT_PATH)
    .raw()
    .toBuffer({ resolveWithObject: true });
  
  const { width, height, channels } = info;
  console.log(`Image: ${width}×${height}, channels: ${channels}`);
  
  const newData = Buffer.from(data);
  let replacedPixels = 0;
  
  for (let i = 0; i < newData.length; i += channels) {
    const r = newData[i];
    const g = newData[i + 1];
    const b = newData[i + 2];
    
    // If pixel is very dark (near-black background), replace with white
    if (r <= DARK_THRESHOLD && g <= DARK_THRESHOLD && b <= DARK_THRESHOLD) {
      newData[i] = 255;     // R
      newData[i + 1] = 255; // G
      newData[i + 2] = 255; // B
      replacedPixels++;
    }
  }
  
  console.log(`Replaced ${replacedPixels} dark pixels → white`);
  console.log(`Preserved ${(width * height) - replacedPixels} logo artwork pixels`);
  
  await sharp(newData, {
    raw: { width, height, channels },
  })
    .png({ quality: 100, compressionLevel: 6 })
    .toFile(OUTPUT_PATH);
  
  console.log('✓ Logo written to:', OUTPUT_PATH);
  
  // Verify output
  const verification = await sharp(OUTPUT_PATH).raw().toBuffer({ resolveWithObject: true });
  const corners = [[0, 0], [width-1, 0], [0, height-1], [width-1, height-1]];
  corners.forEach(([x, y]) => {
    const idx = (y * width + x) * channels;
    const vdata = verification.data;
    console.log(`Corner ${x},${y}:`, vdata[idx], vdata[idx+1], vdata[idx+2]);
  });
  
  console.log('Done! Logo background converted to pure white.');
}

processLogo().catch(console.error);
