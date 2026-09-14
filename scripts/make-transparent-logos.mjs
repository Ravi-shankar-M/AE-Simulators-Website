import sharp from 'sharp';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

async function processLogos() {
  console.log('Processing logos with smooth anti-aliased transparency for dark footer integration...');

  // 1. Process AESIM Logo
  const aesimPath = resolve(projectRoot, 'public/images/AESIM Logo.png');
  const aesimTransparentPath = resolve(projectRoot, 'public/images/aesim-logo-transparent.png');

  const aesimImg = sharp(aesimPath);
  const { data: aesimData, info: aesimInfo } = await aesimImg.ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  const { width: w1, height: h1, channels: c1 } = aesimInfo;
  const newAesimData = Buffer.from(aesimData);

  for (let i = 0; i < newAesimData.length; i += c1) {
    const r = newAesimData[i];
    const g = newAesimData[i + 1];
    const b = newAesimData[i + 2];
    const minC = Math.min(r, g, b);

    // If pure/near white, make transparent with smooth edge anti-aliasing
    if (minC >= 230) {
      newAesimData[i + 3] = 0;
    } else if (minC >= 200) {
      // Fade out edge pixels smoothly
      const alpha = Math.floor((230 - minC) / 30 * 255);
      newAesimData[i + 3] = alpha;
    }
  }

  await sharp(newAesimData, { raw: { width: w1, height: h1, channels: c1 } })
    .png()
    .toFile(aesimTransparentPath);
  console.log('✓ Created ultra-clean transparent AESIM logo at:', aesimTransparentPath);

  // 2. Process Make In India logo
  const miiPath = resolve(projectRoot, 'public/images/make-in-india.png');
  const miiDarkModePath = resolve(projectRoot, 'public/images/make-in-india-darkmode.png');

  const miiImg = sharp(miiPath);
  const { data: miiData, info: miiInfo } = await miiImg.ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  const { width: w2, height: h2, channels: c2 } = miiInfo;
  const newMiiData = Buffer.from(miiData);

  for (let i = 0; i < newMiiData.length; i += c2) {
    const r = newMiiData[i];
    const g = newMiiData[i + 1];
    const b = newMiiData[i + 2];
    const minC = Math.min(r, g, b);

    if (minC >= 230) {
      newMiiData[i + 3] = 0;
    } else {
      const maxC = Math.max(r, g, b);
      if (maxC < 210) {
        const inverted = 255 - maxC;
        const silverVal = Math.min(245, Math.max(150, Math.floor(inverted * 0.85 + 65)));
        newMiiData[i] = silverVal;
        newMiiData[i + 1] = silverVal;
        newMiiData[i + 2] = silverVal + 4;
        newMiiData[i + 3] = 255;
      } else {
        newMiiData[i] = 255;
        newMiiData[i + 1] = 255;
        newMiiData[i + 2] = 255;
        newMiiData[i + 3] = 255;
      }
    }
  }

  await sharp(newMiiData, { raw: { width: w2, height: h2, channels: c2 } })
    .png()
    .toFile(miiDarkModePath);
  console.log('✓ Created ultra-clean dark mode Make in India logo at:', miiDarkModePath);
}

processLogos().catch(console.error);
