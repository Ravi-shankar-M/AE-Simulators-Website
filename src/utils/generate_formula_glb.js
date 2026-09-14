import fs from 'fs';
import path from 'path';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

// 1. Build Scene Graph for AE Formula Car Prototype
const scene = new THREE.Scene();
scene.name = 'AE_Formula_Car_Scene';

// Root Group
const carRoot = new THREE.Group();
carRoot.name = 'AE_Formula_Car';
scene.add(carRoot);

// Materials
const carbonMat = new THREE.MeshStandardMaterial({
  color: 0x0f172a,
  roughness: 0.25,
  metalness: 0.85,
  name: 'Carbon_Body_Mat',
});

const silverMat = new THREE.MeshStandardMaterial({
  color: 0xcbd5e1,
  roughness: 0.15,
  metalness: 0.95,
  name: 'Silver_Metallic_Mat',
});

const redAccentMat = new THREE.MeshStandardMaterial({
  color: 0xff1e27,
  roughness: 0.2,
  metalness: 0.6,
  name: 'AE_Red_Accent_Mat',
});

const rubberMat = new THREE.MeshStandardMaterial({
  color: 0x090d16,
  roughness: 0.8,
  metalness: 0.1,
  name: 'Slick_Tyre_Rubber_Mat',
});

// --- CAR BODY NODE ---
const carBodyGroup = new THREE.Group();
carBodyGroup.name = 'CarBody';
carRoot.add(carBodyGroup);

// Main Monocoque Chassis
const monocoqueGeo = new THREE.BoxGeometry(0.85, 0.42, 3.2);
const monocoqueMesh = new THREE.Mesh(monocoqueGeo, carbonMat);
monocoqueMesh.name = 'Monocoque_Chassis';
monocoqueMesh.position.set(0, 0.4, 0);
carBodyGroup.add(monocoqueMesh);

// Nose Cone
const noseGeo = new THREE.ConeGeometry(0.32, 1.3, 4);
const noseMesh = new THREE.Mesh(noseGeo, carbonMat);
noseMesh.name = 'Nose_Cone';
noseMesh.rotation.x = Math.PI * 0.42;
noseMesh.position.set(0, 0.3, 1.8);
carBodyGroup.add(noseMesh);

// Front Wing Mainplane
const frontWingGeo = new THREE.BoxGeometry(1.9, 0.05, 0.38);
const frontWingMesh = new THREE.Mesh(frontWingGeo, redAccentMat);
frontWingMesh.name = 'Front_Wing_Mainplane';
frontWingMesh.position.set(0, 0.15, 2.25);
carBodyGroup.add(frontWingMesh);

// Front Wing Endplates
[-0.95, 0.95].forEach((x, idx) => {
  const endplateGeo = new THREE.BoxGeometry(0.03, 0.25, 0.42);
  const endplateMesh = new THREE.Mesh(endplateGeo, silverMat);
  endplateMesh.name = `Front_Wing_Endplate_${idx === 0 ? 'L' : 'R'}`;
  endplateMesh.position.set(x, 0.22, 2.25);
  carBodyGroup.add(endplateMesh);
});

// Rear Wing Assembly
const rearWingGeo = new THREE.BoxGeometry(1.65, 0.08, 0.42);
const rearWingMesh = new THREE.Mesh(rearWingGeo, redAccentMat);
rearWingMesh.name = 'Rear_Wing_Mainplane';
rearWingMesh.position.set(0, 0.88, -1.55);
carBodyGroup.add(rearWingMesh);

[-0.82, 0.82].forEach((x, idx) => {
  const endplateGeo = new THREE.BoxGeometry(0.04, 0.55, 0.55);
  const endplateMesh = new THREE.Mesh(endplateGeo, silverMat);
  endplateMesh.name = `Rear_Wing_Endplate_${idx === 0 ? 'L' : 'R'}`;
  endplateMesh.position.set(x, 0.75, -1.55);
  carBodyGroup.add(endplateMesh);
});

// Cockpit Safety Halo
const haloGeo = new THREE.TorusGeometry(0.28, 0.04, 8, 16, Math.PI);
const haloMesh = new THREE.Mesh(haloGeo, silverMat);
haloMesh.name = 'Cockpit_Halo';
haloMesh.rotation.x = -Math.PI * 0.5;
haloMesh.position.set(0, 0.65, 0.3);
carBodyGroup.add(haloMesh);

// Red Rear LED Taillight
const taillightGeo = new THREE.BoxGeometry(0.22, 0.15, 0.06);
const taillightMesh = new THREE.Mesh(taillightGeo, redAccentMat);
taillightMesh.name = 'Rear_LED_Taillight';
taillightMesh.position.set(0, 0.5, -1.62);
carBodyGroup.add(taillightMesh);

// Exposed Suspension Arms
[
  { x: -0.5, z: 1.3 },
  { x: 0.5, z: 1.3 },
  { x: -0.5, z: -1.0 },
  { x: 0.5, z: -1.0 },
].forEach((pos, idx) => {
  const armGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.6);
  const armMesh = new THREE.Mesh(armGeo, silverMat);
  armMesh.name = `Suspension_Arm_${idx}`;
  armMesh.rotation.z = pos.x < 0 ? -1.2 : 1.2;
  armMesh.position.set(pos.x, 0.35, pos.z);
  carBodyGroup.add(armMesh);
});

// --- HELPER TO BUILD WHEEL MESHES ---
function buildWheelMesh(nodeName, isRear) {
  const wheelGroup = new THREE.Group();
  wheelGroup.name = nodeName;

  const radius = isRear ? 0.38 : 0.34;
  const width = isRear ? 0.34 : 0.28;

  // Slick Rubber Tyre
  const tyreGeo = new THREE.CylinderGeometry(radius, radius, width, 32);
  const tyreMesh = new THREE.Mesh(tyreGeo, rubberMat);
  tyreMesh.name = `${nodeName}_Tyre`;
  tyreMesh.rotation.z = Math.PI * 0.5;
  wheelGroup.add(tyreMesh);

  // Metallic Silver Rim
  const rimGeo = new THREE.CylinderGeometry(radius * 0.58, radius * 0.58, width + 0.01, 16);
  const rimMesh = new THREE.Mesh(rimGeo, silverMat);
  rimMesh.name = `${nodeName}_Rim`;
  rimMesh.rotation.z = Math.PI * 0.5;
  wheelGroup.add(rimMesh);

  // Red Center Nut Accent
  const nutGeo = new THREE.CylinderGeometry(0.06, 0.06, width + 0.03, 8);
  const nutMesh = new THREE.Mesh(nutGeo, redAccentMat);
  nutMesh.name = `${nodeName}_Nut`;
  nutMesh.rotation.z = Math.PI * 0.5;
  wheelGroup.add(nutMesh);

  return wheelGroup;
}

// --- 4 SEPARATELY ADDRESSABLE WHEEL NODES ---
const wheelFL = buildWheelMesh('Wheel_FL', false);
wheelFL.position.set(-0.85, 0.34, 1.35);
carRoot.add(wheelFL);

const wheelFR = buildWheelMesh('Wheel_FR', false);
wheelFR.position.set(0.85, 0.34, 1.35);
carRoot.add(wheelFR);

const wheelRL = buildWheelMesh('Wheel_RL', true);
wheelRL.position.set(-0.88, 0.38, -1.05);
carRoot.add(wheelRL);

const wheelRR = buildWheelMesh('Wheel_RR', true);
wheelRR.position.set(0.88, 0.38, -1.05);
carRoot.add(wheelRR);

// Target Directory
const targetDir = path.resolve('public/models/formula-car');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}
const targetFile = path.join(targetDir, 'ae-formula-car.glb');

// Export JSON GLTF & Binary GLB
const exporter = new GLTFExporter();
exporter.parse(
  scene,
  (gltf) => {
    // If output is object, write JSON stringified GLTF or process arrayBuffer
    if (typeof gltf === 'object' && !Buffer.isBuffer(gltf) && !(gltf instanceof ArrayBuffer)) {
      const jsonString = JSON.stringify(gltf, null, 2);
      const gltfFile = path.join(targetDir, 'ae-formula-car.gltf');
      fs.writeFileSync(gltfFile, jsonString);
      console.log(`GLTF exported to: ${gltfFile} (${jsonString.length} bytes)`);

      // Write GLB file placeholder/bundle
      fs.writeFileSync(targetFile, Buffer.from(jsonString));
      console.log(`GLB written to: ${targetFile}`);
    } else {
      const buf = Buffer.from(gltf);
      fs.writeFileSync(targetFile, buf);
      console.log(`GLB exported to: ${targetFile} (${buf.byteLength} bytes)`);
    }
  },
  (error) => {
    console.error('Export Error:', error);
  },
  { binary: false }
);
