import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Html } from '@react-three/drei';
import * as THREE from 'three';
import AESimulator3D from './AESimulator3D';

// Camera position presets for the 6-stage storytelling flow
const CAMERA_PRESETS = [
  // 0: HERO VIEW (3/4 angle, elegant product framing)
  { pos: [3.8, 2.2, 4.2], target: [0, 0.7, 0], fov: 42 },
  // 1: SIMULATOR OVERVIEW
  { pos: [3.2, 1.9, 3.5], target: [0, 0.8, 0], fov: 40 },
  // 2: MOTION PLATFORM & 6 ACTUATORS CLOSE-UP
  { pos: [2.6, 0.6, 2.8], target: [0, 0.4, 0], fov: 38 },
  // 3: COCKPIT & DRIVER INTERFACE
  { pos: [1.2, 1.6, 1.8], target: [0, 0.9, 0.2], fov: 35 },
  // 4: SIMULATION DISPLAY & SOFTWARE ENGINE
  { pos: [0.0, 1.55, 1.6], target: [0, 1.4, 0.7], fov: 32 },
  // 5: TELEMETRY VIEW
  { pos: [-2.8, 1.8, 3.2], target: [0, 0.8, 0], fov: 38 },
  // 6: DRIVER EVALUATION VIEW
  { pos: [3.5, 2.5, 3.5], target: [0, 0.6, 0], fov: 42 }
];

function CameraController({ storySection = 0, isInteractive = false }) {
  const currentPos = useRef(new THREE.Vector3(3.8, 2.2, 4.2));
  const currentTarget = useRef(new THREE.Vector3(0, 0.7, 0));

  useFrame((state, delta) => {
    const preset = CAMERA_PRESETS[Math.min(Math.max(storySection, 0), CAMERA_PRESETS.length - 1)];
    const targetPos = new THREE.Vector3(...preset.pos);
    const targetLookAt = new THREE.Vector3(...preset.target);

    // Subtle gentle orbit motion when idle in hero view
    if (storySection === 0) {
      const time = state.clock.getElapsedTime();
      targetPos.x += Math.sin(time * 0.3) * 0.2;
      targetPos.z += Math.cos(time * 0.3) * 0.2;
    }

    const factor = Math.min(delta * 3.5, 1.0);
    currentPos.current.lerp(targetPos, factor);
    currentTarget.current.lerp(targetLookAt, factor);

    state.camera.position.copy(currentPos.current);
    state.camera.lookAt(currentTarget.current);
  });

  return null;
}

// 3D Hotspot overlay positions
const HOTSPOT_LOCATIONS = [
  { id: 'COCKPIT', pos: [0, 1.2, 0.1], label: 'COCKPIT' },
  { id: 'MOTION PLATFORM', pos: [0, 0.6, -0.8], label: '6-DOF PLATFORM' },
  { id: 'ACTUATORS', pos: [1.1, 0.4, 0.8], label: 'ACTUATORS' },
  { id: 'STEERING SYSTEM', pos: [0, 1.45, 0.45], label: 'STEERING' },
  { id: 'PEDALS', pos: [0, 0.65, 0.7], label: 'PEDALS' },
  { id: 'DISPLAY SYSTEM', pos: [0, 1.95, 0.75], label: 'DISPLAY RIG' },
  { id: 'CONTROL CABINET', pos: [1.8, 0.8, 0], label: 'CONTROL UNIT' }
];

export default function SimulatorStudioCanvas({
  storySection = 0,
  activeHotspot = null,
  motion = { roll: 0, pitch: 0, yaw: 0, surge: 0, sway: 0, heave: 0 },
  hoveredHotspot = null,
  onSelectHotspot = () => {},
  showHotspots = true
}) {
  return (
    <div className="simulator-canvas-wrapper" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        shadows
        camera={{ position: [3.8, 2.2, 4.2], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        {/* LIGHT STUDIO ENVIRONMENT (#FFFFFF Studio) */}
        <color attach="background" args={['#ffffff']} />

        <ambientLight intensity={1.2} color="#ffffff" />

        {/* Primary Studio Directional Key Light */}
        <directionalLight
          position={[6, 9, 5]}
          intensity={1.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
          color="#ffffff"
        />

        {/* Soft Studio Fill Light */}
        <directionalLight position={[-6, 6, -5]} intensity={0.8} color="#f0f4f8" />

        {/* Subtle Rim Light for Metal Accent Highlights */}
        <pointLight position={[0, 4, -4]} intensity={1.5} color="#E31B23" distance={8} />

        {/* Smooth Contact Shadow Plane under Base */}
        <ContactShadows
          position={[0, -0.41, 0]}
          opacity={0.45}
          scale={10}
          blur={2.2}
          far={4}
          color="#000000"
        />

        {/* Light Ground Studio Floor Plane */}
        <mesh position={[0, -0.42, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[60, 60]} />
          <meshStandardMaterial color="#f7f7f5" roughness={0.9} metalness={0.05} />
        </mesh>

        {/* Camera Controller Driven by Scroll / Section */}
        <CameraController storySection={storySection} />

        {/* AE-SIMULATORS 3D Assembly */}
        <AESimulator3D
          activeHotspot={activeHotspot}
          hoveredHotspot={hoveredHotspot}
          motion={motion}
          onSelectHotspot={onSelectHotspot}
        />

        {/* 3D Interactive Hotspot Markers */}
        {showHotspots && HOTSPOT_LOCATIONS.map((spot) => (
          <Html key={spot.id} position={spot.pos} center distanceFactor={8}>
            <button
              type="button"
              className={`hotspot-marker-btn ${activeHotspot === spot.id ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectHotspot(spot.id);
              }}
              title={spot.label}
            >
              <span className="hotspot-dot" />
              <span className="hotspot-pulse" />
              <span className="hotspot-label-text">{spot.label}</span>
            </button>
          </Html>
        ))}
      </Canvas>
    </div>
  );
}
