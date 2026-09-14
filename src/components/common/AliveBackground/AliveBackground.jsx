import React, { useState, useEffect } from 'react';
import aeRealSimulatorImg from '../Simulators/sections/MotionPlatform/images/ae-real-simulator.png';

export default function AliveBackground({ mouseParallax = { x: 0, y: 0 } }) {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
    }
  }, []);

  // Extremely subtle, low-sensitivity parallax (camera drift, not obvious movement)
  const px = isTouchDevice ? 0 : mouseParallax.x * 0.25;
  const py = isTouchDevice ? 0 : mouseParallax.y * 0.25;

  return (
    <div className="real-simulator-bg-wrapper">
      {/* 1. REALISTIC AUTOMOTIVE SIMULATOR PHOTOGRAPH BACKDROP */}
      <div
        className="simulator-photo-layer"
        style={{
          backgroundImage: `url(${aeRealSimulatorImg})`,
          transform: `translate3d(${px}px, ${py}px, 0) scale(1.03)`,
        }}
      />

      {/* 2. HEAVY DARK GRAPHITE & BLACK GRADIENT OVERLAYS (70-80% Dark, 20-30% Photo Visibility) */}
      {/* Left-to-Right Heavy Solid Gradient to keep left hero text 100% readable */}
      <div className="left-dark-gradient-overlay" />

      {/* Radial Industrial Dark Vignette Overlay */}
      <div className="radial-dark-vignette-overlay" />

      {/* Top Header Dark Shield Gradient for Logo Protection */}
      <div className="header-logo-shield-overlay" />

      {/* 3. SUBTLE ATMOSPHERIC INDUSTRIAL LIGHT MOVEMENT */}
      <div className="subtle-industrial-red-glow" />
    </div>
  );
}
