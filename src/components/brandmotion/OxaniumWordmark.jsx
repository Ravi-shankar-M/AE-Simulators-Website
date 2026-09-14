import React, { useState, useEffect } from 'react';

export default function OxaniumWordmark({ active }) {
  const [swept, setSwept] = useState(false);

  useEffect(() => {
    if (active && !swept) {
      const timer = setTimeout(() => setSwept(true), 400);
      return () => clearTimeout(timer);
    }
  }, [active, swept]);

  const text = 'AE-SIMULATORS';

  return (
    <div className={`brandmotion-wordmark-layer ${active ? 'active' : ''}`}>
      <div className={`wordmark-badge-container ${swept ? 'swept' : ''}`}>
        {/* Single Specular Light Sweep Line (Left -> Right) */}
        <div className="wordmark-specular-sweep-line" />

        {/* Custom Oxanium Metallic Display Typography */}
        <h1 className="brandmotion-wordmark-text">
          {text.split('').map((char, index) => (
            <span
              key={index}
              className="metallic-letter-construct"
              style={{ animationDelay: `${index * 45}ms` }}
            >
              {char}
            </span>
          ))}
        </h1>
      </div>
    </div>
  );
}
