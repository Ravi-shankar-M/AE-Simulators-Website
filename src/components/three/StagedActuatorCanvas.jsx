import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';

/**
 * 4-Stage Industrial Actuator Assembly 3D Model with Offscreen (Left/Right) Entrance Vectors
 */
function StagedActuatorModel({ scrollProgress = 0, isHovered, onHoverChange, onClickActuator }) {
  const groupRef = useRef();
  const pistonRef = useRef();

  // Lerped progress ratio for silky smooth 60 FPS movement
  const lerpedProgress = useRef(0);

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
  });

  useFrame((state, delta) => {
    // Lerp progress for smooth movement
    lerpedProgress.current = THREE.MathUtils.lerp(lerpedProgress.current, scrollProgress, delta * 4.5);
    const p = lerpedProgress.current;

    // Gentle rotation of the main actuator assembly
    if (groupRef.current) {
      groupRef.current.rotation.y = -0.35 + Math.sin(state.clock.elapsedTime * 0.4) * 0.05;
      groupRef.current.rotation.x = 0.12 + Math.cos(state.clock.elapsedTime * 0.3) * 0.03;
    }

    // Stage 04 operational extension/retraction demo movement
    if (p >= 0.75 && pistonRef.current) {
      const demoExt = Math.sin(state.clock.elapsedTime * 1.8) * 0.25;
      pistonRef.current.position.z = 0.8 + demoExt;
    }
  });

  const p = scrollProgress;

  // Calculate Assembly Factors for each stage (0.0 = Offscreen/Exploded, 1.0 = Assembled in place)
  // Stage 1 Factor: maps p in [0.0, 0.25] -> [0, 1]
  const stage1Factor = Math.min(Math.max(p / 0.25, 0), 1);
  // Stage 2 Factor: maps p in [0.25, 0.50] -> [0, 1]
  const stage2Factor = Math.min(Math.max((p - 0.25) / 0.25, 0), 1);
  // Stage 3 Factor: maps p in [0.50, 0.75] -> [0, 1]
  const stage3Factor = Math.min(Math.max((p - 0.50) / 0.25, 0), 1);
  // Stage 4 Factor: maps p in [0.75, 1.00] -> [0, 1]
  const stage4Factor = Math.min(Math.max((p - 0.75) / 0.25, 0), 1);

  // Offscreen offsets (Parts enter from Left: -X or Right: +X)
  // Stage 1 Offscreen Left & Right
  const s1LeftX = (-10) * (1 - stage1Factor);
  const s1RightX = (+10) * (1 - stage1Factor);

  // Stage 2 Offscreen Left & Right
  const s2LeftX = (-12) * (1 - stage2Factor);
  const s2RightX = (+12) * (1 - stage2Factor);

  // Stage 3 Offscreen Left & Right
  const s3LeftX = (-14) * (1 - stage3Factor);
  const s3RightX = (+14) * (1 - stage3Factor);

  // Stage 4 Offscreen Left & Right
  const s4LeftX = (-12) * (1 - stage4Factor);
  const s4RightX = (+12) * (1 - stage4Factor);

  return (
    <group
      ref={groupRef}
      position={[0, 0.15, 0]}
      rotation={[0.12, -0.35, 0]}
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
      {/* ============================================================
          STAGE 01 COMPONENTS — BASE STRUCTURE
          - Rear Clevis (Enters from Left: s1LeftX)
          - Motor Mounting Block (Enters from Right: s1RightX)
          ============================================================ */}
      <group position={[s1LeftX, 0, -2.2]}>
        <mesh material={metallicChassisMaterial}>
          <boxGeometry args={[1.1, 1.1, 0.4]} />
        </mesh>
        <mesh position={[0, 0, -0.3]} rotation={[Math.PI / 2, 0, 0]} material={metallicChassisMaterial}>
          <cylinderGeometry args={[0.3, 0.3, 1.2, 24]} />
        </mesh>
      </group>

      <group position={[s1RightX, 0, -1.3]}>
        <mesh material={housingShellMaterial}>
          <boxGeometry args={[1.3, 1.3, 1.2]} />
        </mesh>
        <mesh position={[0, 0.75, 0]} material={aeRedAccentMaterial}>
          <boxGeometry args={[0.5, 0.3, 0.5]} />
        </mesh>
      </group>

      {/* ============================================================
          STAGE 02 COMPONENTS — DRIVE MECHANISM
          - Ball Screw Shaft (Enters from Left: s2LeftX)
          - Thrust Bearing Pack (Enters from Right: s2RightX)
          - Brass Ball Nut (Enters from Left: s2LeftX)
          ============================================================ */}
      <group position={[s2LeftX, 0, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={chromeShaftMaterial}>
          <cylinderGeometry args={[0.16, 0.16, 3.4, 32]} />
        </mesh>
        {[...Array(12)].map((_, i) => (
          <mesh key={i} position={[0, 0, -1.4 + i * 0.25]} rotation={[Math.PI / 2, 0, 0]} material={chromeShaftMaterial}>
            <torusGeometry args={[0.17, 0.02, 12, 24]} />
          </mesh>
        ))}
      </group>

      <group position={[s2RightX, 0, -0.6]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={aeRedAccentMaterial}>
          <cylinderGeometry args={[0.65, 0.65, 0.25, 32]} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={brassNutMaterial}>
          <cylinderGeometry args={[0.45, 0.45, 0.3, 24]} />
        </mesh>
      </group>

      <group position={[s2LeftX, 0, 0.2]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={brassNutMaterial}>
          <cylinderGeometry args={[0.42, 0.42, 0.65, 28]} />
        </mesh>
        <mesh position={[0, 0, -0.2]} rotation={[Math.PI / 2, 0, 0]} material={aeRedAccentMaterial}>
          <cylinderGeometry args={[0.58, 0.58, 0.1, 28]} />
        </mesh>
      </group>

      {/* ============================================================
          STAGE 03 COMPONENTS — HOUSING INTEGRATION
          - Outer Cylinder Shell (Enters from Right: s3RightX)
          - Servo Motor Coupling Shaft (Enters from Left: s3LeftX)
          - AE Red Badge Plate (Enters from Right: s3RightX)
          ============================================================ */}
      <group position={[s3RightX, 0, 0.4]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={housingShellMaterial}>
          <cylinderGeometry args={[0.75, 0.75, 2.2, 32, 1, true]} />
        </mesh>
        <mesh position={[0, 0.77, 0]} material={aeRedAccentMaterial}>
          <boxGeometry args={[0.6, 0.02, 1.2]} />
        </mesh>
      </group>

      <group position={[s3LeftX, 0, -0.7]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={chromeShaftMaterial}>
          <cylinderGeometry args={[0.18, 0.18, 0.6, 24]} />
        </mesh>
      </group>

      {/* ============================================================
          STAGE 04 COMPONENTS — FINAL PISTON & FRONT CLEVIS
          - Telescoping Piston Rod (Enters from Right: s4RightX)
          - Front Seal Cap (Enters from Left: s4LeftX)
          - Front Rod End Clevis (Enters from Right: s4RightX)
          ============================================================ */}
      <group ref={pistonRef} position={[s4RightX, 0, 0.8]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={chromeShaftMaterial}>
          <cylinderGeometry args={[0.35, 0.35, 2.0, 32]} />
        </mesh>

        <mesh position={[0, 0, -0.9 + s4LeftX * 0.1]} rotation={[Math.PI / 2, 0, 0]} material={aeRedAccentMaterial}>
          <cylinderGeometry args={[0.6, 0.6, 0.18, 32]} />
        </mesh>

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
      {isHovered && p >= 0.75 && (
        <mesh position={[0, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.9, 0.9, 4.4, 32]} />
          <meshBasicMaterial color="#E31B23" wireframe opacity={0.25} transparent />
        </mesh>
      )}
    </group>
  );
}

/**
 * Camera Controller
 */
function CameraController({ scrollProgress }) {
  useFrame((state, delta) => {
    const p = scrollProgress;

    // Camera moves subtly between stages
    let targetCamX = 4.8 - p * 1.2;
    let targetCamY = 2.8 - p * 1.2;
    let targetCamZ = 5.2 - p * 1.2;

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetCamX, delta * 3.5);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetCamY, delta * 3.5);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetCamZ, delta * 3.5);

    state.camera.lookAt(0, 0.1, 0);
  });

  return null;
}

export default function StagedActuatorCanvas({ scrollProgress = 0, onClickActuator }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={`staged-canvas-layer ${scrollProgress >= 0.75 ? 'complete-clickable' : ''}`}>
      <Canvas
        camera={{ position: [4.8, 2.8, 5.2], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={1.3} />
        <directionalLight position={[6, 8, 5]} intensity={1.8} castShadow />
        <directionalLight position={[-6, -4, -4]} intensity={0.6} color="#E31B23" />
        <pointLight position={[0, 3, 2]} intensity={0.8} />

        <CameraController scrollProgress={scrollProgress} />

        <Float speed={scrollProgress >= 0.75 ? 1.5 : 0} rotationIntensity={0.1} floatIntensity={0.2}>
          <StagedActuatorModel
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
