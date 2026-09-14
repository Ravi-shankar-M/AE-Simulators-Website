import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function TireSmoke({ carPositionX = 0, isSmoking = false }) {
  const pointsRef = useRef();
  const particleCount = 100;

  const [positions] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.8;
      pos[i * 3 + 1] = Math.random() * 0.4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }
    return [pos];
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current || !isSmoking) return;

    const posAttr = pointsRef.current.geometry.attributes.position;
    for (let i = 0; i < particleCount; i++) {
      let x = posAttr.getX(i);
      let y = posAttr.getY(i);
      let z = posAttr.getZ(i);

      x += delta * 2.2;
      y += delta * 0.4;
      z += (Math.random() - 0.5) * 0.05;

      if (x > 4.0 || y > 1.2) {
        x = (Math.random() - 0.5) * 0.5;
        y = Math.random() * 0.2;
      }
      posAttr.setXYZ(i, x, y, z);
    }
    posAttr.needsUpdate = true;
  });

  if (!isSmoking) return null;

  return (
    <points ref={pointsRef} position={[carPositionX - 1.2, 0.2, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.65}
        color="#f1f5f9"
        transparent
        opacity={0.4}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
