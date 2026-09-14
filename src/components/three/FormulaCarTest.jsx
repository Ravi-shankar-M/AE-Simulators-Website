import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

import aeFormulaCarJsonData from '../../pages/Simulators/Models/ae-formula-car.json';

function TestCarModel({ isRotatingRear, isRotatingFront }) {
  const groupRef = useRef();
  const wheelRLRef = useRef();
  const wheelRRRef = useRef();
  const wheelFLRef = useRef();
  const wheelFRRef = useRef();
  const [modelLoaded, setModelLoaded] = useState(false);

  useEffect(() => {
    try {
      const loader = new THREE.ObjectLoader();
      const obj = loader.parse(aeFormulaCarJsonData);
      groupRef.current.add(obj);

      // Traversal & Node Identification
      obj.traverse((child) => {
        if (child.name === 'Wheel_RL') wheelRLRef.current = child;
        if (child.name === 'Wheel_RR') wheelRRRef.current = child;
        if (child.name === 'Wheel_FL') wheelFLRef.current = child;
        if (child.name === 'Wheel_FR') wheelFRRef.current = child;
      });

      setModelLoaded(true);
    } catch (err) {
      console.error('Failed to parse 3D car model:', err);
    }
  }, []);

  useFrame((_, delta) => {
    if (isRotatingRear) {
      if (wheelRLRef.current) wheelRLRef.current.rotation.x += delta * 15;
      if (wheelRRRef.current) wheelRRRef.current.rotation.x += delta * 15;
    }

    if (isRotatingFront) {
      if (wheelFLRef.current) wheelFLRef.current.rotation.x += delta * 15;
      if (wheelFRRef.current) wheelFRRef.current.rotation.x += delta * 15;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {!modelLoaded && (
        <mesh>
          <boxGeometry args={[1, 0.5, 2]} />
          <meshBasicMaterial color="#ff1e27" wireframe />
        </mesh>
      )}
    </group>
  );
}

export default function FormulaCarTest() {
  const [isRotatingRear, setIsRotatingRear] = useState(false);
  const [isRotatingFront, setIsRotatingFront] = useState(false);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#050505', position: 'relative' }}>
      {/* 3D Development Inspection UI Overlay */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 1000,
          background: 'rgba(15, 18, 24, 0.92)',
          border: '1px solid rgba(255, 30, 39, 0.6)',
          padding: '1.2rem',
          borderRadius: '10px',
          color: '#ffffff',
          fontFamily: 'sans-serif',
          width: '340px',
          boxShadow: '0 0 25px rgba(255, 30, 39, 0.3)',
        }}
      >
        <h3 style={{ margin: '0 0 0.8rem 0', color: '#ff1e27', fontSize: '1rem', letterSpacing: '0.08em' }}>
          3D FORMULA CAR MODEL TEST
        </h3>
        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', color: '#cbd5e1' }}>
          <strong>MODEL:</strong> AE Original Prototype (3D GLB/JSON)
        </p>
        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', color: '#cbd5e1' }}>
          <strong>FILE:</strong> public/models/formula-car/ae-formula-car.glb
        </p>
        <p style={{ margin: '0 0 1rem 0', fontSize: '0.8rem', color: '#4ade80' }}>
          <strong>STATUS:</strong> 4 Wheel Meshes Separately Addressable
        </p>

        {/* Wheel Rotation Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <button
            onClick={() => setIsRotatingRear((prev) => !prev)}
            style={{
              padding: '0.6rem 1rem',
              background: isRotatingRear ? '#ff1e27' : '#1e293b',
              color: '#ffffff',
              border: '1px solid #ff1e27',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              textTransform: 'uppercase',
              fontSize: '0.75rem',
            }}
          >
            {isRotatingRear ? 'STOP Rear Wheels' : 'ROTATE Rear Wheels'}
          </button>

          <button
            onClick={() => setIsRotatingFront((prev) => !prev)}
            style={{
              padding: '0.6rem 1rem',
              background: isRotatingFront ? '#ff1e27' : '#1e293b',
              color: '#ffffff',
              border: '1px solid #ff1e27',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              textTransform: 'uppercase',
              fontSize: '0.75rem',
            }}
          >
            {isRotatingFront ? 'STOP Front Wheels' : 'ROTATE Front Wheels'}
          </button>
        </div>
      </div>

      {/* R3F 3D Model Development Stage */}
      <Canvas shadows gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[3, 2, 4]} fov={45} />
        <OrbitControls enableDamping dampingFactor={0.05} />

        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 15, 10]} intensity={1.8} castShadow />
        <pointLight position={[-5, 3, -5]} color="#ff1e27" intensity={3.5} />
        <spotLight position={[0, 8, 0]} intensity={1.2} angle={0.6} />

        {/* Dark Metallic Floor Grid */}
        <gridHelper args={[20, 20, '#ff1e27', '#1e293b']} position={[0, 0, 0]} />

        {/* 3D Car Model */}
        <TestCarModel isRotatingRear={isRotatingRear} isRotatingFront={isRotatingFront} />
      </Canvas>
    </div>
  );
}
