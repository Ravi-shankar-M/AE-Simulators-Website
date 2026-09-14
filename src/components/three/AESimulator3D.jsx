import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Optional external model loader helper
function ExternalGLBModel({ url, activeHotspot, motion }) {
  const { scene } = useGLTF(url);
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  return <primitive object={clonedScene} scale={1.2} position={[0, 0, 0]} />;
}

// 6-DOF Stewart Platform Kinematics Geometry Helper
// Base geometry parameters (meters)
const BASE_RADIUS = 1.35;
const PLATFORM_RADIUS = 1.1;
const BASE_ANGLES = [
  -Math.PI / 6, Math.PI / 6,
  Math.PI / 2 - Math.PI / 6, Math.PI / 2 + Math.PI / 6,
  -Math.PI / 2 - Math.PI / 6, -Math.PI / 2 + Math.PI / 6
];
const PLATFORM_ANGLES = [
  -Math.PI / 6 + Math.PI / 12, Math.PI / 6 - Math.PI / 12,
  Math.PI / 2 - Math.PI / 6 + Math.PI / 12, Math.PI / 2 + Math.PI / 6 - Math.PI / 12,
  -Math.PI / 2 - Math.PI / 6 + Math.PI / 12, -Math.PI / 2 + Math.PI / 6 - Math.PI / 12
];

class GLTFErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err) {
    console.warn("External GLB load error, using parametric model:", err);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

import glb360 from '../../pages/Simulators/Gaming/models/final_360_web.glb?url';

export default function AESimulator3D({
  activeHotspot = null,
  motion = { roll: 0, pitch: 0, yaw: 0, surge: 0, sway: 0, heave: 0 },
  hoveredHotspot = null,
  onSelectHotspot = () => {}
}) {
  const [hasExternalModel, setHasExternalModel] = useState(true);
  const [modelUrl, setModelUrl] = useState(glb360);

  if (hasExternalModel && modelUrl) {
    return (
      <GLTFErrorBoundary fallback={<ParametricAESimulatorMesh activeHotspot={activeHotspot} hoveredHotspot={hoveredHotspot} motion={motion} onSelectHotspot={onSelectHotspot} />}>
        <React.Suspense fallback={<ParametricAESimulatorMesh activeHotspot={activeHotspot} hoveredHotspot={hoveredHotspot} motion={motion} onSelectHotspot={onSelectHotspot} />}>
          <ExternalGLBModel url={modelUrl} activeHotspot={activeHotspot} motion={motion} />
        </React.Suspense>
      </GLTFErrorBoundary>
    );
  }

  return (
    <ParametricAESimulatorMesh
      activeHotspot={activeHotspot}
      hoveredHotspot={hoveredHotspot}
      motion={motion}
      onSelectHotspot={onSelectHotspot}
    />
  );
}


function ParametricAESimulatorMesh({
  activeHotspot,
  hoveredHotspot,
  motion,
  onSelectHotspot
}) {
  const topPlatformGroupRef = useRef();

  // Compute 6-DOF platform matrix & actuator joint positions
  const baseJoints = useMemo(() => {
    return BASE_ANGLES.map((angle) => new THREE.Vector3(
      BASE_RADIUS * Math.cos(angle),
      0.15,
      BASE_RADIUS * Math.sin(angle)
    ));
  }, []);

  const initialPlatformJointsLocal = useMemo(() => {
    return PLATFORM_ANGLES.map((angle) => new THREE.Vector3(
      PLATFORM_RADIUS * Math.cos(angle),
      0.0,
      PLATFORM_RADIUS * Math.sin(angle)
    ));
  }, []);

  // Smooth lerped motion values
  const currentMotion = useRef({ roll: 0, pitch: 0, yaw: 0, surge: 0, sway: 0, heave: 0 });

  useFrame((_, delta) => {
    const factor = Math.min(delta * 6.0, 1.0);
    currentMotion.current.roll += (motion.roll - currentMotion.current.roll) * factor;
    currentMotion.current.pitch += (motion.pitch - currentMotion.current.pitch) * factor;
    currentMotion.current.yaw += (motion.yaw - currentMotion.current.yaw) * factor;
    currentMotion.current.surge += (motion.surge - currentMotion.current.surge) * factor;
    currentMotion.current.sway += (motion.sway - currentMotion.current.sway) * factor;
    currentMotion.current.heave += (motion.heave - currentMotion.current.heave) * factor;

    const rollRad = (currentMotion.current.roll * Math.PI) / 180;
    const pitchRad = (currentMotion.current.pitch * Math.PI) / 180;
    const yawRad = (currentMotion.current.yaw * Math.PI) / 180;

    const posX = currentMotion.current.sway;
    const posY = 1.05 + currentMotion.current.heave;
    const posZ = currentMotion.current.surge;

    if (topPlatformGroupRef.current) {
      topPlatformGroupRef.current.position.set(posX, posY, posZ);
      topPlatformGroupRef.current.rotation.set(pitchRad, yawRad, rollRad);
    }
  });

  // Material Palette (High-precision Industrial Light Studio setup)
  const matBasePlate = useMemo(() => new THREE.MeshStandardMaterial({
    color: 0x111317,
    roughness: 0.35,
    metalness: 0.85
  }), []);

  const matFrameSteel = useMemo(() => new THREE.MeshStandardMaterial({
    color: 0x1c1f24,
    roughness: 0.25,
    metalness: 0.90
  }), []);

  const matAluminium = useMemo(() => new THREE.MeshStandardMaterial({
    color: 0xd0d5dd,
    roughness: 0.20,
    metalness: 0.95
  }), []);

  const matSeatFabric = useMemo(() => new THREE.MeshStandardMaterial({
    color: 0x0d0e11,
    roughness: 0.70,
    metalness: 0.15
  }), []);

  const matRedAccent = useMemo(() => new THREE.MeshStandardMaterial({
    color: 0xe51937,
    roughness: 0.2,
    metalness: 0.5,
    emissive: 0x400008
  }), []);

  const matScreenGlass = useMemo(() => new THREE.MeshStandardMaterial({
    color: 0x080b12,
    roughness: 0.1,
    metalness: 0.9,
    emissive: 0x0d1526,
    emissiveIntensity: 0.8
  }), []);

  // Helper check for active hotspot
  const isHotspotActive = (key) => activeHotspot === key || hoveredHotspot === key;

  return (
    <group name="AE_Simulator_Assembly" position={[0, -0.4, 0]}>

      {/* ============================================================
          01. STRUCTURAL BASE PLATFORM (HEXAPOD GROUND FRAME)
          ============================================================ */}
      <group name="GroundBaseFrame">
        {/* Base Ring / Hexagonal Plate */}
        <mesh position={[0, 0.08, 0]} receiveShadow castShadow material={matBasePlate}>
          <cylinderGeometry args={[BASE_RADIUS + 0.15, BASE_RADIUS + 0.2, 0.16, 6]} />
        </mesh>

        {/* Industrial Base Beams */}
        {[0, 1, 2].map((i) => (
          <mesh
            key={`beam-${i}`}
            position={[0, 0.15, 0]}
            rotation={[0, (i * Math.PI) / 3, 0]}
            castShadow
            material={matFrameSteel}
          >
            <boxGeometry args={[0.18, 0.12, (BASE_RADIUS + 0.1) * 2]} />
          </mesh>
        ))}

        {/* Base Actuator Clevis Mounts (6 pairs) */}
        {baseJoints.map((pt, idx) => (
          <group key={`base-clevis-${idx}`} position={[pt.x, pt.y, pt.z]}>
            <mesh castShadow material={matAluminium}>
              <cylinderGeometry args={[0.08, 0.09, 0.12, 16]} />
            </mesh>
            <mesh position={[0, 0.08, 0]} material={matRedAccent}>
              <sphereGeometry args={[0.05, 16, 16]} />
            </mesh>
          </group>
        ))}

        {/* CONTROL CABINET (Industrial Power & Motion Box) */}
        <group
          position={[BASE_RADIUS + 0.45, 0.5, 0]}
          rotation={[0, -Math.PI / 6, 0]}
          onClick={(e) => { e.stopPropagation(); onSelectHotspot('CONTROL CABINET'); }}
        >
          {/* Main Enclosure */}
          <mesh castShadow material={isHotspotActive('CONTROL CABINET') ? matRedAccent : matFrameSteel}>
            <boxGeometry args={[0.5, 0.9, 0.6]} />
          </mesh>

          {/* Cooling Vents */}
          <mesh position={[-0.26, 0.1, 0]} material={matAluminium}>
            <boxGeometry args={[0.02, 0.4, 0.45]} />
          </mesh>

          {/* Industrial Status LED Indicator */}
          <mesh position={[-0.26, 0.35, 0.2]}>
            <sphereGeometry args={[0.025, 16, 16]} />
            <meshBasicMaterial color="#E31B23" />
          </mesh>
          <pointLight position={[-0.3, 0.35, 0.2]} color="#E31B23" intensity={1.5} distance={1.2} />

          {/* Cable Conduit Trunking */}
          <mesh position={[-0.15, -0.4, 0]} rotation={[0, 0, Math.PI / 4]} material={matBasePlate}>
            <cylinderGeometry args={[0.04, 0.04, 0.4, 12]} />
          </mesh>
        </group>
      </group>

      {/* ============================================================
          02. TOP MOVING PLATFORM & COCKPIT ASSEMBLY
          ============================================================ */}
      <group ref={topPlatformGroupRef} position={[0, 1.05, 0]}>

        {/* Stewart Platform Top Hexagonal Mounting Plate */}
        <mesh
          position={[0, 0.05, 0]}
          castShadow
          receiveShadow
          material={isHotspotActive('MOTION PLATFORM') ? matRedAccent : matBasePlate}
          onClick={(e) => { e.stopPropagation(); onSelectHotspot('MOTION PLATFORM'); }}
        >
          <cylinderGeometry args={[PLATFORM_RADIUS + 0.1, PLATFORM_RADIUS + 0.15, 0.12, 6]} />
        </mesh>

        {/* Top Joint Mounts */}
        {initialPlatformJointsLocal.map((pt, idx) => (
          <group key={`top-clevis-${idx}`} position={[pt.x, pt.y - 0.02, pt.z]}>
            <mesh castShadow material={matAluminium}>
              <sphereGeometry args={[0.06, 16, 16]} />
            </mesh>
          </group>
        ))}

        {/* COCKPIT CHASSIS FRAME & ROLL CAGE */}
        <group
          position={[0, 0.25, 0]}
          onClick={(e) => { e.stopPropagation(); onSelectHotspot('COCKPIT'); }}
        >
          {/* Main Floor Sub-frame */}
          <mesh castShadow material={isHotspotActive('COCKPIT') ? matRedAccent : matFrameSteel}>
            <boxGeometry args={[1.1, 0.08, 1.8]} />
          </mesh>

          {/* Tubing Roll Cage (Left & Right Rails) */}
          <mesh position={[-0.52, 0.45, 0]} castShadow material={matFrameSteel}>
            <boxGeometry args={[0.06, 0.8, 1.7]} />
          </mesh>
          <mesh position={[0.52, 0.45, 0]} castShadow material={matFrameSteel}>
            <boxGeometry args={[0.06, 0.8, 1.7]} />
          </mesh>

          {/* AUTOMOTIVE RACING SEAT (NO HUMANS) */}
          <group position={[0, 0.35, -0.3]}>
            {/* Seat Cushion */}
            <mesh castShadow material={matSeatFabric}>
              <boxGeometry args={[0.55, 0.14, 0.55]} />
            </mesh>
            {/* Seat Backrest */}
            <mesh position={[0, 0.48, -0.24]} rotation={[0.15, 0, 0]} castShadow material={matSeatFabric}>
              <boxGeometry args={[0.52, 0.85, 0.12]} />
            </mesh>
            {/* Headrest */}
            <mesh position={[0, 0.95, -0.3]} castShadow material={matSeatFabric}>
              <boxGeometry args={[0.35, 0.22, 0.14]} />
            </mesh>
            {/* Red Accent Stitching / Harness Detail */}
            <mesh position={[0, 0.55, -0.17]} material={matRedAccent}>
              <boxGeometry args={[0.18, 0.4, 0.02]} />
            </mesh>
          </group>

          {/* STEERING SYSTEM & DASHBOARD */}
          <group
            position={[0, 0.55, 0.35]}
            onClick={(e) => { e.stopPropagation(); onSelectHotspot('STEERING SYSTEM'); }}
          >
            {/* Steering Column Tube */}
            <mesh rotation={[0.45, 0, 0]} castShadow material={matFrameSteel}>
              <cylinderGeometry args={[0.04, 0.04, 0.45, 16]} />
            </mesh>

            {/* Steering Wheel Rim */}
            <mesh
              position={[0, 0.14, -0.12]}
              rotation={[0.45, 0, 0]}
              castShadow
              material={isHotspotActive('STEERING SYSTEM') ? matRedAccent : matFrameSteel}
            >
              <torusGeometry args={[0.16, 0.025, 16, 32]} />
            </mesh>
            {/* Steering Wheel Hub */}
            <mesh position={[0, 0.14, -0.12]} rotation={[0.45, 0, 0]} material={matAluminium}>
              <cylinderGeometry args={[0.06, 0.06, 0.03, 16]} />
            </mesh>

            {/* Dashboard Display Housing */}
            <mesh position={[0, 0.32, 0.05]} castShadow material={matFrameSteel}>
              <boxGeometry args={[0.45, 0.18, 0.12]} />
            </mesh>
            <mesh position={[0, 0.32, 0.12]} material={matScreenGlass}>
              <planeGeometry args={[0.38, 0.13]} />
            </mesh>
          </group>

          {/* PEDALS ASSEMBLY */}
          <group
            position={[0, 0.12, 0.65]}
            onClick={(e) => { e.stopPropagation(); onSelectHotspot('PEDALS'); }}
          >
            {/* Base Plate */}
            <mesh castShadow material={matAluminium}>
              <boxGeometry args={[0.35, 0.03, 0.35]} />
            </mesh>

            {/* Clutch, Brake, Accelerator Pedals */}
            {[-0.1, 0, 0.1].map((xOffset, pIdx) => (
              <group key={`pedal-${pIdx}`} position={[xOffset, 0.12, -0.05]} rotation={[-0.3, 0, 0]}>
                <mesh castShadow material={matFrameSteel}>
                  <boxGeometry args={[0.02, 0.18, 0.02]} />
                </mesh>
                <mesh
                  position={[0, 0.08, 0.02]}
                  material={isHotspotActive('PEDALS') ? matRedAccent : matAluminium}
                >
                  <boxGeometry args={[0.06, 0.09, 0.015]} />
                </mesh>
              </group>
            ))}
          </group>

          {/* DISPLAY SYSTEM (TRIPLE SCREEN SIMULATOR RIG) */}
          <group
            position={[0, 0.95, 0.75]}
            onClick={(e) => { e.stopPropagation(); onSelectHotspot('DISPLAY SYSTEM'); }}
          >
            {/* Support Rigging */}
            <mesh castShadow material={matFrameSteel}>
              <boxGeometry args={[1.4, 0.06, 0.06]} />
            </mesh>

            {/* Center Widescreen Monitor */}
            <group position={[0, 0.1, 0]}>
              <mesh castShadow material={isHotspotActive('DISPLAY SYSTEM') ? matRedAccent : matFrameSteel}>
                <boxGeometry args={[1.1, 0.58, 0.05]} />
              </mesh>
              <mesh position={[0, 0, 0.03]} material={matScreenGlass}>
                <planeGeometry args={[1.05, 0.53]} />
              </mesh>
            </group>

            {/* Left Angled Monitor */}
            <group position={[-0.92, 0.1, -0.15]} rotation={[0, 0.42, 0]}>
              <mesh castShadow material={isHotspotActive('DISPLAY SYSTEM') ? matRedAccent : matFrameSteel}>
                <boxGeometry args={[0.85, 0.58, 0.05]} />
              </mesh>
              <mesh position={[0, 0, 0.03]} material={matScreenGlass}>
                <planeGeometry args={[0.8, 0.53]} />
              </mesh>
            </group>

            {/* Right Angled Monitor */}
            <group position={[0.92, 0.1, -0.15]} rotation={[0, -0.42, 0]}>
              <mesh castShadow material={isHotspotActive('DISPLAY SYSTEM') ? matRedAccent : matFrameSteel}>
                <boxGeometry args={[0.85, 0.58, 0.05]} />
              </mesh>
              <mesh position={[0, 0, 0.03]} material={matScreenGlass}>
                <planeGeometry args={[0.8, 0.53]} />
              </mesh>
            </group>
          </group>
        </group>
      </group>

      {/* ============================================================
          03. 6 ARTICULATED HEAVY-DUTY ACTUATORS (STEWART HEXAPOD)
          ============================================================ */}
      <group
        name="ActuatorsGroup"
        onClick={(e) => { e.stopPropagation(); onSelectHotspot('ACTUATORS'); }}
      >
        {baseJoints.map((bPt, idx) => (
          <ActuatorLeg
            key={`actuator-leg-${idx}`}
            basePt={bPt}
            topGroupRef={topPlatformGroupRef}
            localTopPt={initialPlatformJointsLocal[idx]}
            isHighlighted={isHotspotActive('ACTUATORS')}
            matCylinder={isHotspotActive('ACTUATORS') ? matRedAccent : matFrameSteel}
            matPiston={matAluminium}
          />
        ))}
      </group>
    </group>
  );
}

// Single Actuator Leg with dynamic update targeting top joint
function ActuatorLeg({ basePt, topGroupRef, localTopPt, matCylinder, matPiston, isHighlighted }) {
  const cylinderMeshRef = useRef();
  const pistonMeshRef = useRef();

  useFrame(() => {
    if (!topGroupRef.current || !cylinderMeshRef.current || !pistonMeshRef.current) return;

    // Transform local top joint position into world space
    const worldTopPt = localTopPt.clone();
    topGroupRef.current.localToWorld(worldTopPt);

    // Vector from base joint to top joint
    const diff = worldTopPt.clone().sub(basePt);
    const length = diff.length();
    const midPoint = basePt.clone().add(diff.clone().multiplyScalar(0.5));

    // Cylinder & Piston placement
    const dir = diff.clone().normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const q = new THREE.Quaternion().setFromUnitVectors(up, dir);

    // Update Cylinder
    const cylLen = Math.max(length * 0.55, 0.4);
    const cylPos = basePt.clone().add(dir.clone().multiplyScalar(cylLen * 0.5));
    cylinderMeshRef.current.position.copy(cylPos);
    cylinderMeshRef.current.quaternion.copy(q);

    // Update Piston rod
    const pistonLen = Math.max(length * 0.55, 0.4);
    const pistonPos = worldTopPt.clone().sub(dir.clone().multiplyScalar(pistonLen * 0.5));
    pistonMeshRef.current.position.copy(pistonPos);
    pistonMeshRef.current.quaternion.copy(q);
  });

  return (
    <group>
      {/* Lower Hydraulic / Electric Cylinder */}
      <mesh ref={cylinderMeshRef} castShadow material={matCylinder}>
        <cylinderGeometry args={[0.055, 0.065, 0.65, 16]} />
      </mesh>
      {/* Upper Chrome Sliding Piston */}
      <mesh ref={pistonMeshRef} castShadow material={matPiston}>
        <cylinderGeometry args={[0.038, 0.038, 0.65, 16]} />
      </mesh>
    </group>
  );
}
