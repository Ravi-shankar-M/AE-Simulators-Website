const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const targets = [
  'src/pages/Dashboard/Hero/images/ae-sim-hero-image.png',
  'src/pages/Dashboard/WhatWeBuild/images/dataacquisition-dashboard.png',
  'src/pages/Dashboard/WhatWeBuild/images/analytics-dashboard.png',
  'src/pages/MotionPlatform/images/cockpit-livery.png',
  'src/pages/Dashboard/WhatWeBuild/images/simulation-dashboard.png',
  'src/pages/Dashboard/WhatWeBuild/images/product-dahboard.png',
  'src/pages/MotionPlatform/images/62577075-4426-4ed1-858a-123f147534e4.png',
  'src/pages/MotionPlatform/images/6dof-dashboard.png',
  'src/pages/Dashboard/WhatWeBuild/images/6doffer-dashboard.png',
  'src/pages/Dashboard/WhatWeBuild/images/3dof-dashboard.png',
  'src/pages/About/WorldMap/images/worldmap.png',
  'src/pages/MotionPlatform/images/ae-motion-actuator-detail.png',
  'src/pages/MotionPlatform/images/ae-simulator-cockpit.png',
  'src/pages/MotionPlatform/images/ae-motion-platform.png',
  'src/pages/Technology/SoftwareEngine/images/ae-software-environment.png',
  'src/pages/MotionPlatform/images/ae-real-simulator.png',
  'src/pages/About/Products/images/six_dof_motion_platform.png',
  'src/pages/Technology/SoftwareEngine/images/ae-telemetry-report.png',
  'src/components/sections/Performance/images/simulator_cockpit.png',
  'src/pages/About/Products/images/three_dof_motion_platform_hero.png',
  'src/pages/MotionPlatform/images/three_dof_tripod_platform.png',
  'src/pages/Technology/SoftwareEngine/images/realistic_driving.png',
  'src/pages/MotionPlatform/images/3dof-demo.png',
];

async function convertAll() {
  const rootDir = process.cwd();
  const results = [];
  let totalPngBytes = 0;
  let totalWebpBytes = 0;

  for (const relPath of targets) {
    const pngPath = path.resolve(rootDir, relPath);
    const webpPath = pngPath.replace(/\.png$/, '.webp');

    if (!fs.existsSync(pngPath)) {
      console.error('PNG not found:', pngPath);
      continue;
    }

    const origStats = fs.statSync(pngPath);
    await sharp(pngPath)
      .webp({ quality: 86, effort: 6 })
      .toFile(webpPath);

    const webpStats = fs.statSync(webpPath);
    const savedBytes = origStats.size - webpStats.size;
    const percentSaved = ((savedBytes / origStats.size) * 100).toFixed(1);

    totalPngBytes += origStats.size;
    totalWebpBytes += webpStats.size;

    results.push({
      file: path.basename(pngPath),
      relPath,
      pngSize: origStats.size,
      webpSize: webpStats.size,
      savedBytes,
      percentSaved: `${percentSaved}%`,
    });
  }

  console.log('RESULTS:', JSON.stringify(results, null, 2));
  console.log('TOTAL_PNG_BYTES:', totalPngBytes);
  console.log('TOTAL_WEBP_BYTES:', totalWebpBytes);
  console.log('TOTAL_SAVED_BYTES:', totalPngBytes - totalWebpBytes);
  console.log('OVERALL_SAVED_PERCENT:', `${(((totalPngBytes - totalWebpBytes) / totalPngBytes) * 100).toFixed(1)}%`);
}

convertAll().catch(console.error);
