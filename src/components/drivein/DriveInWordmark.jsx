import React, { useState, useEffect } from 'react';

export default function DriveInWordmark({ active }) {
  const [swept, setSwept] = useState(false);

  useEffect(() => {
    if (active && !swept) {
      const timer = setTimeout(() => setSwept(true), 600);
      return () => clearTimeout(timer);
    }
  }, [active, swept]);

  const text = 'AE-SIMULATORS';

  return (
    <div className={`drivein-wordmark-layer ${active ? 'active' : ''}`}>
      <div className={`wordmark-badge-container ${swept ? 'swept' : ''}`}>
        {/* Left-to-Right Specular Light Sweep Line */}
        <div className="wordmark-specular-sweep-line" />

        {/* Custom Oxanium Metallic Display Typography */}
        <h1 className="drivein-wordmark-text">
          {text.split('').map((char, index) => (
            <span
              key={index}
              className="metallic-letter-construct"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {char}
            </span>
          ))}
        </h1>
      </div>
    </div>
  );
}
