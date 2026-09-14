import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useTexture, Center, Bounds, Html, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import './InteractiveViewer.css';

import glbNew from '../../pages/Simulators/Gaming/models/final_360_web.glb?url';
import liveryImg from '../../pages/MotionPlatform/images/cockpit-livery.webp';

const GLB_PATH = glbNew;
const LIVERY_TEXTURE_PATH = liveryImg;
const FALLBACK_IMG = liveryImg;

// Preload the GLB model
try {
  useGLTF.preload(GLB_PATH, true);
} catch (e) {
  console.warn('GLB preload notice:', e);
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
          padding: '14px 20px',
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
        <span>LOADING 3D ASSETS... {Math.round(progress)}%</span>
      </div>
    </Html>
  );
}

function Model() {
  const { scene } = useGLTF(GLB_PATH, true);
  const liveryMap = useTexture(LIVERY_TEXTURE_PATH);

  useEffect(() => {
    if (liveryMap) {
      liveryMap.colorSpace = THREE.SRGBColorSpace;
      liveryMap.flipY = false;
      liveryMap.needsUpdate = true;
    }

    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.material = new THREE.MeshStandardMaterial({
            map: liveryMap,
            color: 0xFFFFFF,
            roughness: 0.35,
            metalness: 0.15,
            side: THREE.DoubleSide,
          });
        }
      });
    }
  }, [scene, liveryMap]);

  return (
    <primitive object={scene} />
  );
}

class CanvasErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.warn('3D Viewer WebGL notice:', error, info);
  }

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

export default function InteractiveProductViewer() {
  const [isDragging, setIsDragging] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const isMouseDownRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });

  // Check prefers-reduced-motion
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Fallback 2D Image mouse/touch drag tilt controls
  const handleFallbackMouseDown = (e) => {
    isMouseDownRef.current = true;
    setIsDragging(true);
    startPosRef.current = {
      x: e.clientX || (e.touches && e.touches[0].clientX) || 0,
      y: e.clientY || (e.touches && e.touches[0].clientY) || 0
    };
  };

  const handleFallbackMouseMove = (e) => {
    if (!isMouseDownRef.current) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    const dx = clientX - startPosRef.current.x;
    const dy = clientY - startPosRef.current.y;
    setDragOffset((prev) => ({
      x: Math.min(Math.max(prev.x + dx * 0.4, -45), 45),
      y: Math.min(Math.max(prev.y + dy * 0.4, -25), 25)
    }));
    startPosRef.current = { x: clientX, y: clientY };
  };

  const handleFallbackMouseUp = () => {
    isMouseDownRef.current = false;
    setIsDragging(false);
  };

  return (
    <div className="product-viewer-card ae-card">
      <div
        className={`product-viewer-stage ${isDragging ? 'is-grabbing' : 'is-grab'}`}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        style={{ userSelect: 'none', touchAction: 'pan-y' }}
      >
        {useFallback ? (
          <div
            className="fallback-image-wrapper"
            onMouseDown={handleFallbackMouseDown}
            onMouseMove={handleFallbackMouseMove}
            onMouseUp={handleFallbackMouseUp}
            onMouseLeave={handleFallbackMouseUp}
            onTouchStart={handleFallbackMouseDown}
            onTouchMove={handleFallbackMouseMove}
            onTouchEnd={handleFallbackMouseUp}
          >
            <img
              src={FALLBACK_IMG}
              alt="AE Driving Simulator Rig 3D View"
              className="fallback-simulator-img"
              style={{
                transform: `rotateY(${dragOffset.x}deg) rotateX(${-dragOffset.y}deg)`,
                transition: isDragging ? 'none' : 'transform 0.4s ease-out',
                userSelect: 'none',
                pointerEvents: 'none'
              }}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            />
          </div>
        ) : (
          <CanvasErrorBoundary
            fallback={
              <div className="fallback-image-wrapper">
                <img
                  src={FALLBACK_IMG}
                  alt="AE Driving Simulator Rig 3D View"
                  className="fallback-simulator-img"
                />
              </div>
            }
          >
            <Canvas
              camera={{ position: [0, 1.2, 4.2], fov: 45 }}
              style={{ background: '#FFFFFF', width: '100%', height: '100%' }}
              gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
              onCreated={({ gl }) => {
                gl.setClearColor('#FFFFFF');
              }}
              onError={() => setUseFallback(true)}
            >
              <ambientLight intensity={1.8} />
              <directionalLight position={[10, 15, 10]} intensity={2.2} castShadow />
              <directionalLight position={[-10, -10, -10]} intensity={0.8} />
              <directionalLight position={[0, 10, -10]} intensity={1.2} />

              <Suspense fallback={<CanvasLoader />}>
                <Bounds fit clip observe margin={0.68}>
                  <Center>
                    <Model />
                  </Center>
                </Bounds>
              </Suspense>

              <OrbitControls
                makeDefault
                autoRotate={true}
                autoRotateSpeed={0.8}
                enableZoom={false}
                enablePan={false}
                rotateSpeed={0.8}
                onStart={() => setIsDragging(true)}
                onEnd={() => setIsDragging(false)}
              />
            </Canvas>
          </CanvasErrorBoundary>
        )}
      </div>

      {/* UNDER THE GLB VIEWER — ONLY DRAG TO EXPLORE */}
      <div className="product-viewer-instruction font-mono">
        <span className="instruction-text">DRAG TO EXPLORE</span>
      </div>
    </div>
  );
}
