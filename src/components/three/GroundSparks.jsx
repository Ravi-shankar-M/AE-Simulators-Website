import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function GroundSparks({ titlePositionX = 0, isDragging = false }) {
  const pointsRef = useRef();
  const sparkCount = 60;

  const [positions] = useMemo(() => {
    const pos = new Float32Array(sparkCount * 3);
    for (let i = 0; i < sparkCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.4;
      pos[i * 3 + 1] = Math.random() * 0.1;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
    }
    return [pos];
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current || !isDragging) return;

    const posAttr = pointsRef.current.geometry.attributes.position;
    for (let i = 0; i < sparkCount; i++) {
      let x = posAttr.getX(i);
      let y = posAttr.getY(i);
      let z = posAttr.getZ(i);

      x += (Math.random() - 0.2) * delta * 4.0;
      y += (Math.random() - 0.1) * delta * 2.0;

      if (y < 0 || x > 2.0) {
        x = (Math.random() - 0.5) * 0.4;
        y = 0.05;
      }
      posAttr.setXYZ(i, x, y, z);
    }
    posAttr.needsUpdate = true;
  });

  if (!isDragging) return null;

  return (
    <points ref={pointsRef} position={[titlePositionX, 0.05, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#ff5500"
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
