import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center, Bounds, Html, useProgress } from '@react-three/drei';
import * as THREE from 'three';

import glb360 from '../../pages/Simulators/Gaming/models/final_360_web.glb?url';
import fallbackImg from '../../pages/MotionPlatform/images/62577075-4426-4ed1-858a-123f147534e4.webp';

const GLB_360_PATH = glb360;
const FALLBACK_IMG = fallbackImg;

try {
  useGLTF.preload(GLB_360_PATH, true);
} catch (e) {
  console.warn('360 GLB preload notice:', e);
}

function CanvasLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div
        className="font-mono"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(10, 10, 12, 0.88)',
          padding: '12px 18px',
          borderRadius: '6px',
          border: '1px solid rgba(227, 27, 35, 0.5)',
          color: '#FFFFFF',
          fontSize: '0.78rem',
          gap: '8px',
          whiteSpace: 'nowrap',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div
          style={{
            width: '18px',
            height: '18px',
            border: '2px solid rgba(227, 27, 35, 0.2)',
            borderTop: '2px solid #E31B23',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <span>LOADING 360 MODEL... {Math.round(progress)}%</span>
      </div>
    </Html>
  );
}

function GamingCockpitModel() {
  const { scene } = useGLTF(GLB_360_PATH, true);

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.side = THREE.DoubleSide;
            child.material.needsUpdate = true;
          }
        }
      });
    }
  }, [scene]);

  return <primitive object={scene} />;
}

class CanvasErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err) { console.warn('Gaming 360 Canvas Error:', err); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          {this.props.fallback}
          <button
            onClick={() => this.setState({ hasError: false })}
            className="font-mono"
            style={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              background: '#E31B23',
              color: '#FFFFFF',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              cursor: 'pointer',
              zIndex: 10,
            }}
          >
            RETRY 3D VIEW
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function Gaming360Viewer({ height = '560px' }) {
  const [useFallback, setUseFallback] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      style={{
        width: '100%',
        height,
        position: 'relative',
        background: 'transparent',
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
    >
      {useFallback ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '20px' }}>
          <img src={FALLBACK_IMG} alt="Gaming Racing Simulator Cockpit" style={{ maxHeight: '90%', objectFit: 'contain' }} />
        </div>
      ) : (
        <CanvasErrorBoundary fallback={<img src={FALLBACK_IMG} alt="Gaming Cockpit" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}>
          <Canvas
            camera={{ position: [0, 1.2, 4.2], fov: 45 }}
            style={{ background: 'transparent', width: '100%', height: '100%' }}
            gl={{ antialias: true, alpha: true }}
            onCreated={({ gl }) => {
              gl.setClearColor(0x000000, 0);
            }}
            onError={() => setUseFallback(true)}
          >
            {/* CLEAN LIGHTING FOR DIRECT SITE CANVAS */}
            <ambientLight intensity={2.2} />
            <directionalLight position={[10, 15, 10]} intensity={2.8} castShadow />
            <directionalLight position={[-10, 10, -10]} intensity={1.5} />
            <directionalLight position={[0, -10, 10]} intensity={1.2} />
            <spotLight position={[0, 12, 0]} intensity={3.0} angle={0.7} penumbra={0.5} />

            <Suspense fallback={<CanvasLoader />}>
              <Bounds fit clip observe margin={1.25}>
                <Center>
                  <GamingCockpitModel />
                </Center>
              </Bounds>
            </Suspense>

            <OrbitControls
              makeDefault
              autoRotate={true}
              autoRotateSpeed={1.0}
              enableZoom={true}
              enablePan={false}
              rotateSpeed={0.8}
              onStart={() => setIsDragging(true)}
              onEnd={() => setIsDragging(false)}
            />
          </Canvas>
        </CanvasErrorBoundary>
      )}
    </div>
  );
}
