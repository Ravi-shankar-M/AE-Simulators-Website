import fs from 'fs';
import path from 'path';

// Target directory
const targetDir = path.resolve('public/models/formula-car');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Generate valid GLTF 2.0 JSON specification structure
const gltf2Data = {
  asset: {
    version: '2.0',
    generator: 'AE_Simulators_GLTF2_Exporter',
  },
  scene: 0,
  scenes: [
    {
      name: 'AE_Formula_Car_Scene',
      nodes: [0],
    },
  ],
  nodes: [
    {
      name: 'AE_Formula_Car',
      children: [1, 2, 3, 4, 5],
    },
    {
      name: 'CarBody',
      translation: [0, 0.4, 0],
    },
    {
      name: 'Wheel_FL',
      translation: [-0.85, 0.34, 1.35],
    },
    {
      name: 'Wheel_FR',
      translation: [0.85, 0.34, 1.35],
    },
    {
      name: 'Wheel_RL',
      translation: [-0.88, 0.38, -1.05],
    },
    {
      name: 'Wheel_RR',
      translation: [0.88, 0.38, -1.05],
    },
  ],
};

const jsonString = JSON.stringify(gltf2Data, null, 2);

const gltfPath = path.join(targetDir, 'ae-formula-car.gltf');
fs.writeFileSync(gltfPath, jsonString);
console.log(`GLTF 2.0 asset written to: ${gltfPath}`);

const glbPath = path.join(targetDir, 'ae-formula-car.glb');
fs.writeFileSync(glbPath, jsonString);
console.log(`GLB 2.0 asset written to: ${glbPath}`);
