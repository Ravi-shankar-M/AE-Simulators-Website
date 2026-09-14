import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { SIMULATOR_3D_STATES } from '../../animations/simulatorIntroTimeline';

export default function CinematicCamera({ state, carPositionX = 0 }) {
  const cameraRef = useRef();

  useFrame(() => {
    if (!cameraRef.current) return;

    // Compute smooth target camera position
    let targetX = carPositionX * 0.22;
    let targetY = 2.1;
    let targetZ = 8.2;

    if (state === SIMULATOR_3D_STATES.LOGO_CALM) {
      targetX = 0;
      targetY = 2.3;
      targetZ = 8.8;
    } else if (state === SIMULATOR_3D_STATES.TITLE_SETTLE || state === SIMULATOR_3D_STATES.FINAL_BRAND) {
      targetX = -1.0;
      targetY = 2.0;
      targetZ = 8.0;
    }

    // Smooth camera position interpolation
    cameraRef.current.position.x += (targetX - cameraRef.current.position.x) * 0.04;
    cameraRef.current.position.y += (targetY - cameraRef.current.position.y) * 0.05;
    cameraRef.current.position.z += (targetZ - cameraRef.current.position.z) * 0.05;

    // Subtly add camera vibration shake during maximum acceleration
    if (state === SIMULATOR_3D_STATES.MAX_ACCELERATION || state === SIMULATOR_3D_STATES.CAR_EXIT) {
      cameraRef.current.position.y += (Math.random() - 0.5) * 0.05;
      cameraRef.current.position.z += (Math.random() - 0.5) * 0.05;
    }

    cameraRef.current.lookAt(targetX * 0.4, 0.45, 0);
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 2.3, 8.8]}
      fov={42}
      near={0.1}
      far={1000}
    />
  );
}
