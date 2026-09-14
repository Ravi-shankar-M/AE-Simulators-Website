import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import PlatformParts from './SixDOFPlatform/PlatformParts';
import CameraRig from './SixDOFPlatform/CameraRig';

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshBasicMaterial color="#E31B23" wireframe />
    </mesh>
  );
}

export default function Staged6DOFCanvas({
  scrollProgress = 0,
  isHovered = false,
  onClickPlatform = () => {},
  isVisible = true,
}) {
  const [reducedQuality, setReducedQuality] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const checkQuality = () => {
      const mobile = window.innerWidth < 768;
      const lowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
      setReducedQuality(mobile || lowEnd);
    };
    checkQuality();
    window.addEventListener('resize', checkQuality);
    return () => window.removeEventListener('resize', checkQuality);
  }, []);

  if (!isVisible) {
    return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
  }

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        shadows={!reducedQuality}
        camera={{ position: [3.2, 2.0, 3.6], fov: 42 }}
        dpr={reducedQuality ? [1, 1] : [1, 2]}
        gl={{ antialias: !reducedQuality, alpha: true, powerPreference: 'high-performance' }}
        frameloop={isVisible ? 'always' : 'demand'}
      >
        <Suspense fallback={<LoadingFallback />}>
          <ambientLight intensity={1.3} color="#ffffff" />
          <directionalLight
            position={[6, 9, 5]}
            intensity={1.9}
            castShadow={!reducedQuality}
            shadow-mapSize-width={reducedQuality ? 512 : 2048}
            shadow-mapSize-height={reducedQuality ? 512 : 2048}
            shadow-bias={-0.0001}
            color="#ffffff"
          />
          <directionalLight position={[-6, 6, -5]} intensity={0.8} color="#f0f4f8" />
          <pointLight position={[0, 4, -4]} intensity={1.5} color="#E31B23" distance={8} />

          {!reducedQuality && (
            <ContactShadows
              position={[0, -0.36, 0]}
              opacity={0.45}
              scale={10}
              blur={2.2}
              far={4}
              color="#000000"
            />
          )}

          <mesh position={[0, -0.37, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow={!reducedQuality}>
            <planeGeometry args={[60, 60]} />
            <meshStandardMaterial color="#f7f7f5" roughness={0.9} metalness={0.05} />
          </mesh>

          <CameraRig scrollProgress={scrollProgress} />
          <PlatformParts
            scrollProgress={scrollProgress}
            isHovered={isHovered}
            onClickPlatform={onClickPlatform}
            reducedQuality={reducedQuality}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
