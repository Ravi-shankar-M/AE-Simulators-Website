import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function GroundEffects({ titlePositionX = 0, isDragging = false }) {
  const sparksRef = useRef();
  const dustRef = useRef();
  const particleCount = 80;

  const [sparkPos] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.8;
      pos[i * 3 + 1] = Math.random() * 0.08;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
    }
    return [pos];
  }, []);

  const [dustPos] = useMemo(() => {
    const pos = new Float32Array(50 * 3);
    for (let i = 0; i < 50; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 1.0;
      pos[i * 3 + 1] = Math.random() * 0.2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
    }
    return [pos];
  }, []);

  useFrame((_, delta) => {
    if (!isDragging) return;

    if (sparksRef.current) {
      const posAttr = sparksRef.current.geometry.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        let x = posAttr.getX(i);
        let y = posAttr.getY(i);

        x += (Math.random() - 0.2) * delta * 5.0;
        y += (Math.random() - 0.1) * delta * 2.5;

        if (y < 0 || x > 2.5) {
          x = (Math.random() - 0.5) * 0.5;
          y = 0.04;
        }
        posAttr.setXYZ(i, x, y, posAttr.getZ(i));
      }
      posAttr.needsUpdate = true;
    }

    if (dustRef.current) {
      const dustAttr = dustRef.current.geometry.attributes.position;
      for (let i = 0; i < 50; i++) {
        let x = dustAttr.getX(i);
        let y = dustAttr.getY(i);

        x += delta * 1.8;
        y += delta * 0.3;

        if (x > 3.0 || y > 0.8) {
          x = (Math.random() - 0.5) * 0.6;
          y = 0.05;
        }
        dustAttr.setXYZ(i, x, y, dustAttr.getZ(i));
      }
      dustAttr.needsUpdate = true;
    }
  });

  if (!isDragging) return null;

  return (
    <group position={[titlePositionX, 0.05, 0]}>
      {/* Ground Friction Sparks */}
      <points ref={sparksRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[sparkPos, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.16}
          color="#ff5500"
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Ground Contact Dust Cloud */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustPos, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.55}
          color="#cbd5e1"
          transparent
          opacity={0.35}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
