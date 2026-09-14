import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, MeshReflectorMaterial } from '@react-three/drei';
import { SIMULATOR_3D_STATES } from '../../animations/simulatorIntroTimeline';
import FormulaCar3D from './FormulaCar3D';
import Chain3D from './Chain3D';
import SimulatorTitle3D from './SimulatorTitle3D';
import TireSmoke from './TireSmoke';
import GroundEffects from './GroundEffects';

export default function SimulatorIntroScene({ state }) {
  // Compute X positions for 3D car and 3D title driven by state timeline
  const carX = useMemo(() => {
    switch (state) {
      case SIMULATOR_3D_STATES.LOGO_CALM:
        return 8.5; // Outside stage right (+X)
      case SIMULATOR_3D_STATES.CAR_ENTRY:
        return 4.2;
      case SIMULATOR_3D_STATES.CAR_APPROACH:
        return 1.8; // Center-Right
      case SIMULATOR_3D_STATES.CHAIN_TENSION:
        return 0.8;
      case SIMULATOR_3D_STATES.TITLE_DRAG_START:
        return -0.8;
      case SIMULATOR_3D_STATES.CAR_ACCELERATE:
        return -3.8;
      case SIMULATOR_3D_STATES.MAX_ACCELERATION:
        return -6.8; // Accelerates left
      case SIMULATOR_3D_STATES.CAR_EXIT:
      case SIMULATOR_3D_STATES.TITLE_SETTLE:
      case SIMULATOR_3D_STATES.FINAL_BRAND:
      case SIMULATOR_3D_STATES.COMPLETE:
        return -14.0; // Exit offstage left
      default:
        return 8.5;
    }
  }, [state]);

  const titleX = useMemo(() => {
    switch (state) {
      case SIMULATOR_3D_STATES.LOGO_CALM:
      case SIMULATOR_3D_STATES.CAR_ENTRY:
      case SIMULATOR_3D_STATES.CAR_APPROACH:
      case SIMULATOR_3D_STATES.CHAIN_TENSION:
        return 6.0; // Stationary right
      case SIMULATOR_3D_STATES.TITLE_DRAG_START:
        return 3.2; // Resists weight, starts sliding
      case SIMULATOR_3D_STATES.CAR_ACCELERATE:
        return 0.2;
      case SIMULATOR_3D_STATES.MAX_ACCELERATION:
        return -2.5;
      case SIMULATOR_3D_STATES.CAR_EXIT:
      case SIMULATOR_3D_STATES.TITLE_SETTLE:
      case SIMULATOR_3D_STATES.FINAL_BRAND:
      case SIMULATOR_3D_STATES.COMPLETE:
        return -2.0; // Settles left-center
      default:
        return 6.0;
    }
  }, [state]);

  const isSmoking = [
    SIMULATOR_3D_STATES.CAR_ENTRY,
    SIMULATOR_3D_STATES.CAR_APPROACH,
    SIMULATOR_3D_STATES.CHAIN_TENSION,
    SIMULATOR_3D_STATES.TITLE_DRAG_START,
    SIMULATOR_3D_STATES.CAR_ACCELERATE,
    SIMULATOR_3D_STATES.MAX_ACCELERATION,
    SIMULATOR_3D_STATES.CAR_EXIT,
  ].includes(state);

  const isDragging = [
    SIMULATOR_3D_STATES.TITLE_DRAG_START,
    SIMULATOR_3D_STATES.CAR_ACCELERATE,
    SIMULATOR_3D_STATES.MAX_ACCELERATION,
  ].includes(state);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Canvas
        shadows
        style={{ width: '100%', height: '100%', background: '#050505', position: 'absolute', top: 0, left: 0 }}
        gl={{ antialias: true, alpha: false }}
      >
        {/* Step 4 Perspective Camera */}
        <PerspectiveCamera makeDefault position={[0, 2.2, 8.5]} fov={42} />

        {/* Step 5 Cinematic Studio Lighting Setup */}
        <ambientLight intensity={0.45} />
        <directionalLight position={[10, 16, 10]} intensity={2.0} castShadow />
        <pointLight position={[-10, 3, -5]} color="#ff1e27" intensity={4.5} distance={22} />
        <pointLight position={[carX - 1.2, 1.2, 1.5]} color="#ff1e27" intensity={5.0} distance={8} />

        {/* Dark Graphite Reflective Engineering Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <MeshReflectorMaterial
            blur={[300, 100]}
            resolution={1024}
            mirror={0.58}
            mixBlur={0.8}
            mixStrength={1.5}
            roughness={0.42}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#07070a"
            metalness={0.65}
          />
        </mesh>

        {/* STEP 8: Stationary 3D Formula Car Model */}
        <FormulaCar3D state={state} positionX={carX} />

        {/* 3D Segmented Metallic Chain */}
        <Chain3D state={state} carX={carX} titleX={titleX} />

        {/* 3D Extruded Metallic Title */}
        <SimulatorTitle3D positionX={titleX} />

        {/* Three.js Rear Tyre Smoke Particles */}
        <TireSmoke carPositionX={carX} isSmoking={isSmoking} />

        {/* Three.js Ground Contact Friction Sparks & Dust */}
        <GroundEffects titlePositionX={titleX} isDragging={isDragging} />
      </Canvas>
    </div>
  );
}
