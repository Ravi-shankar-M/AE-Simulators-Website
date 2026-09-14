import React, { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { SIMULATOR_3D_STATES } from '../../animations/simulatorIntroTimeline';

export default function Chain3D({ state, carX = 0, titleX = 3 }) {
  const chainGroupRef = React.useRef();

  const isTight = [
    SIMULATOR_3D_STATES.TITLE_DRAG_START,
    SIMULATOR_3D_STATES.CAR_ACCELERATE,
    SIMULATOR_3D_STATES.MAX_ACCELERATION,
    SIMULATOR_3D_STATES.CAR_EXIT,
  ].includes(state);

  const links = useMemo(() => {
    const count = 16;
    const items = [];
    for (let i = 0; i < count; i++) {
      items.push(i);
    }
    return items;
  }, []);

  const dist = Math.max(0.5, titleX - carX);

  useFrame((_, delta) => {
    if (chainGroupRef.current && isTight) {
      // Subtle tension oscillation wave traveling through chain
      chainGroupRef.current.position.y = 0.4 + Math.sin(Date.now() * 0.02) * 0.015;
    }
  });

  return (
    <group ref={chainGroupRef} position={[carX - 0.45, 0.4, 0]}>
      {links.map((i) => {
        const factor = i / 16;
        const x = factor * dist;
        const sag = isTight ? 0 : Math.sin(factor * Math.PI) * -0.22;

        return (
          <mesh
            key={i}
            position={[x, sag, 0]}
            rotation={[0, 0, i % 2 === 0 ? 0 : Math.PI / 2]}
            castShadow
          >
            <torusGeometry args={[0.08, 0.028, 10, 20]} />
            <meshStandardMaterial
              color="#e2e8f0"
              metalness={0.95}
              roughness={0.12}
              envMapIntensity={1.8}
            />
          </mesh>
        );
      })}
    </group>
  );
}
