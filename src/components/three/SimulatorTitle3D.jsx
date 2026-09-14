import React from 'react';
import { Center } from '@react-three/drei';

export default function SimulatorTitle3D({ positionX = 3 }) {
  return (
    <group position={[positionX, 0.38, 0]}>
      <Center>
        {/* 3D Extruded Metallic Title Block Mesh */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[3.4, 0.72, 0.28]} />
          <meshStandardMaterial
            color="#e2e8f0"
            metalness={0.92}
            roughness={0.18}
            envMapIntensity={2.0}
          />
        </mesh>

        {/* Dark Extrusion Bevel Backing */}
        <mesh position={[0, -0.05, -0.1]} receiveShadow>
          <boxGeometry args={[3.45, 0.76, 0.15]} />
          <meshStandardMaterial color="#0f172a" roughness={0.6} metalness={0.8} />
        </mesh>
      </Center>
    </group>
  );
}
