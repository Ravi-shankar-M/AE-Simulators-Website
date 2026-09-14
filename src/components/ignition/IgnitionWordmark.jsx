import React, { useState, useEffect } from 'react';

export default function IgnitionWordmark({ active }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [swept, setSwept] = useState(false);

  useEffect(() => {
    if (active && !swept) {
      const timer = setTimeout(() => setSwept(true), 500);
      return () => clearTimeout(timer);
    }
  }, [active, swept]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 4;
      const y = (e.clientY / window.innerHeight - 0.5) * 4;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const text = 'AE-SIMULATORS';

  return (
    <div
      className={`ignition-wordmark-layer ${active ? 'active' : ''}`}
      style={{
        transform: active
          ? `translate(calc(-50% + ${mousePos.x}px), calc(-55% + ${mousePos.y}px))`
          : 'translate(-50%, -50%)',
      }}
    >
      <div className={`wordmark-badge-container ${swept ? 'swept' : ''}`}>
        {/* Single Light Sweep Line (Left -> Right) */}
        <div className="wordmark-light-sweep-line" />

        {/* Custom Oxanium Metallic Display Typography */}
        <h1 className="ignition-wordmark-text">
          {text.split('').map((char, index) => (
            <span
              key={index}
              className="metallic-letter"
              style={{ animationDelay: `${index * 45}ms` }}
            >
              {char}
            </span>
          ))}
        </h1>

        {/* Thin Pulsing AE-Red Energy Accent Line */}
        <div className="wordmark-red-energy-line" />
      </div>
    </div>
  );
}
