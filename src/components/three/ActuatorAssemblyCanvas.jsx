import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Float, Html } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Procedural Industrial Actuator 3D Model with Independent Explosive Components
 */
function IndustrialActuatorMesh({ scrollProgress = 0, isHovered, onHoverChange, onClickActuator }) {
  const groupRef = useRef();
  const pistonRef = useRef();

  // Lerped scroll ratio for silky smooth 60 FPS transitions
  const lerpedRatio = useRef(0);

  // Materials
  const metallicChassisMaterial = new THREE.MeshStandardMaterial({
    color: '#1E2530',
    metalness: 0.85,
    roughness: 0.25,
  });

  const chromeShaftMaterial = new THREE.MeshStandardMaterial({
    color: '#E2E8F0',
    metalness: 0.95,
    roughness: 0.1,
  });

  const aeRedAccentMaterial = new THREE.MeshStandardMaterial({
    color: isHovered ? '#FF2A33' : '#E31B23',
    metalness: 0.6,
    roughness: 0.2,
    emissive: isHovered ? '#E31B23' : '#000000',
    emissiveIntensity: isHovered ? 0.35 : 0.0,
  });

  const brassNutMaterial = new THREE.MeshStandardMaterial({
    color: '#D4AF37',
    metalness: 0.8,
    roughness: 0.3,
  });

  const housingShellMaterial = new THREE.MeshStandardMaterial({
    color: isHovered ? '#252F3E' : '#171C24',
    metalness: 0.7,
    roughness: 0.3,
    wireframe: false,
  });

  useFrame((state, delta) => {
    // Smooth lerp scroll progress
    lerpedRatio.current = THREE.MathUtils.lerp(lerpedRatio.current, scrollProgress, delta * 4.5);
    const r = lerpedRatio.current;

    // Component explosion offsets (Factor is 1.0 when r=0, 0.0 when r=0.75+)
    const expFactor = Math.max(0, (0.75 - r) / 0.75);

    // Subtle gentle slow rotation of the actuator assembly
    if (groupRef.current) {
      groupRef.current.rotation.y = -0.4 + Math.sin(state.clock.elapsedTime * 0.5) * 0.08;
      groupRef.current.rotation.x = 0.15 + Math.cos(state.clock.elapsedTime * 0.4) * 0.04;
    }

    // Stage 04 subtle functional extension/retraction demo movement
    if (r >= 0.7 && pistonRef.current) {
      const demoExt = Math.sin(state.clock.elapsedTime * 1.8) * 0.25;
      pistonRef.current.position.z = 0.8 + demoExt;
    } else if (pistonRef.current) {
      // Physical assembly movement
      pistonRef.current.position.z = 0.8 + expFactor * 2.2;
    }
  });

  const r = scrollProgress;
  const exp = Math.max(0, (0.75 - r) / 0.75);

  return (
    <group
      ref={groupRef}
      position={[0, 0.2, 0]}
      rotation={[0.15, -0.4, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHoverChange(true);
      }}
      onPointerOut={() => onHoverChange(false)}
      onClick={(e) => {
        e.stopPropagation();
        onClickActuator();
      }}
    >
      {/* 01. REAR MOUNT CLEVIS (z = -3.2 -> 0) */}
      <group position={[0, 0, -2.2 - exp * 2.2]}>
        <mesh material={metallicChassisMaterial}>
          <boxGeometry args={[1.1, 1.1, 0.4]} />
        </mesh>
        <mesh position={[0, 0, -0.3]} rotation={[Math.PI / 2, 0, 0]} material={metallicChassisMaterial}>
          <cylinderGeometry args={[0.3, 0.3, 1.2, 24]} />
        </mesh>
        {/* Alignment Indicator Line */}
        {exp > 0.05 && (
          <mesh position={[0, 0, 0.5]} material={aeRedAccentMaterial}>
            <cylinderGeometry args={[0.005, 0.005, exp * 2.0, 8]} rotation={[Math.PI / 2, 0, 0]} />
          </mesh>
        )}
      </group>

      {/* 02. SERVO MOTOR HOUSING (z = -1.5 -> 0) */}
      <group position={[0, 0, -1.3 - exp * 1.6]}>
        <mesh material={housingShellMaterial}>
          <boxGeometry args={[1.3, 1.3, 1.2]} />
        </mesh>
        {/* Encoder / Connector Block */}
        <mesh position={[0, 0.75, 0]} material={aeRedAccentMaterial}>
          <boxGeometry args={[0.5, 0.3, 0.5]} />
        </mesh>
        {/* Motor Shaft */}
        <mesh position={[0, 0, 0.7]} rotation={[Math.PI / 2, 0, 0]} material={chromeShaftMaterial}>
          <cylinderGeometry args={[0.18, 0.18, 0.6, 24]} />
        </mesh>
      </group>

      {/* 03. BEARING PACK & COUPLING (z = -0.6 -> 0) */}
      <group position={[0, 0, -0.6 - exp * 1.1]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={aeRedAccentMaterial}>
          <cylinderGeometry args={[0.65, 0.65, 0.25, 32]} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={brassNutMaterial}>
          <cylinderGeometry args={[0.45, 0.45, 0.3, 24]} />
        </mesh>
      </group>

      {/* 04. PRECISION BALL SCREW SHAFT (Centerpiece) */}
      <group position={[0, 0, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={chromeShaftMaterial}>
          <cylinderGeometry args={[0.16, 0.16, 3.4, 32]} />
        </mesh>
        {/* Thread Ribs */}
        {[...Array(12)].map((_, i) => (
          <mesh key={i} position={[0, 0, -1.4 + i * 0.25]} rotation={[Math.PI / 2, 0, 0]} material={chromeShaftMaterial}>
            <torusGeometry args={[0.17, 0.02, 12, 24]} />
          </mesh>
        ))}
      </group>

      {/* 05. RECIRCULATING BALL NUT (z = 0.2 -> 0) */}
      <group position={[0, 0, 0.2 + exp * 0.9]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={brassNutMaterial}>
          <cylinderGeometry args={[0.42, 0.42, 0.65, 28]} />
        </mesh>
        {/* Mounting Flange */}
        <mesh position={[0, 0, -0.2]} rotation={[Math.PI / 2, 0, 0]} material={aeRedAccentMaterial}>
          <cylinderGeometry args={[0.58, 0.58, 0.1, 28]} />
        </mesh>
      </group>

      {/* 06. OUTER PROTECTIVE HOUSING CYLINDER (Explodes sideways y/z) */}
      <group position={[0, exp * 1.8, 0.4 + exp * 1.2]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={housingShellMaterial}>
          <cylinderGeometry args={[0.75, 0.75, 2.2, 32, 1, true]} />
        </mesh>
        {/* AE Brand Badge Plate on Housing */}
        <mesh position={[0, 0.77, 0]} material={aeRedAccentMaterial}>
          <boxGeometry args={[0.6, 0.02, 1.2]} />
        </mesh>
      </group>

      {/* 07. TELESCOPING PISTON ROD & FRONT END (z = 0.8 -> 0.8 + exp) */}
      <group ref={pistonRef} position={[0, 0, 0.8 + exp * 2.2]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={chromeShaftMaterial}>
          <cylinderGeometry args={[0.35, 0.35, 2.0, 32]} />
        </mesh>

        {/* 08. FRONT CAP & SEAL RING */}
        <mesh position={[0, 0, -0.9]} rotation={[Math.PI / 2, 0, 0]} material={aeRedAccentMaterial}>
          <cylinderGeometry args={[0.6, 0.6, 0.18, 32]} />
        </mesh>

        {/* 09. FRONT CLEVIS / MOUNTING ROD END */}
        <group position={[0, 0, 1.1]}>
          <mesh material={metallicChassisMaterial}>
            <boxGeometry args={[0.9, 0.9, 0.5]} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={chromeShaftMaterial}>
            <cylinderGeometry args={[0.25, 0.25, 1.1, 24]} />
          </mesh>
        </group>
      </group>

      {/* STAGE 04 HOVER OUTLINE AURA */}
      {isHovered && scrollProgress >= 0.7 && (
        <mesh position={[0, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.9, 0.9, 4.4, 32]} />
          <meshBasicMaterial color="#E31B23" wireframe opacity={0.25} transparent />
        </mesh>
      )}
    </group>
  );
}

/**
 * Camera & Lighting Controller
 */
function SceneController({ scrollProgress }) {
  useFrame((state, delta) => {
    // Smooth camera positioning linked to scroll stages
    // Stage 01: Wide overview
    // Stage 02: Closer internal zoom
    // Stage 03: Product focus
    // Stage 04: Hero presentation view
    const r = scrollProgress;

    let targetCamX = 4.2 - r * 1.2;
    let targetCamY = 2.2 - r * 0.6;
    let targetCamZ = 4.5 - r * 1.0;

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetCamX, delta * 3.5);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetCamY, delta * 3.5);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetCamZ, delta * 3.5);

    state.camera.lookAt(0, 0.1, 0);
  });

  return null;
}

export default function ActuatorAssemblyCanvas({ scrollProgress = 0, onClickActuator }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={`actuator-canvas-container ${scrollProgress >= 0.7 ? 'stage-complete' : ''}`}>
      <Canvas
        camera={{ position: [4.2, 2.2, 4.5], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[6, 8, 5]} intensity={1.8} castShadow />
        <directionalLight position={[-6, -4, -4]} intensity={0.6} color="#E31B23" />
        <pointLight position={[0, 3, 2]} intensity={0.8} />

        <SceneController scrollProgress={scrollProgress} />

        <Float speed={scrollProgress >= 0.7 ? 1.5 : 0} rotationIntensity={0.1} floatIntensity={0.2}>
          <IndustrialActuatorMesh
            scrollProgress={scrollProgress}
            isHovered={isHovered}
            onHoverChange={setIsHovered}
            onClickActuator={onClickActuator}
          />
        </Float>

        <ContactShadows
          position={[0, -1.8, 0]}
          opacity={0.35}
          scale={10}
          blur={2}
          far={4}
          color="#000000"
        />
      </Canvas>
    </div>
  );
}
