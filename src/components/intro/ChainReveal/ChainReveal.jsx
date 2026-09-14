import React from 'react';
import { ARRIVAL_STATES } from '../animations/arrivalAnimation';

export default function ChainReveal({ state }) {
  const isVisible = [
    ARRIVAL_STATES.CHAIN_REVEAL,
    ARRIVAL_STATES.BRAND_APPEAR,
    ARRIVAL_STATES.ACCELERATION,
    ARRIVAL_STATES.CAR_EXIT,
    ARRIVAL_STATES.TRANSITION,
    ARRIVAL_STATES.FINAL_BRAND,
  ].includes(state);

  const isPulledMid = [
    ARRIVAL_STATES.BRAND_APPEAR,
    ARRIVAL_STATES.ACCELERATION,
    ARRIVAL_STATES.CAR_EXIT,
    ARRIVAL_STATES.TRANSITION,
    ARRIVAL_STATES.FINAL_BRAND,
  ].includes(state);

  return (
    <div
      className={`chain-reveal-container ${isVisible ? 'visible' : ''} ${
        isPulledMid ? 'pulled-mid' : ''
      }`}
    >
      {/* Heavy Segmented Metallic SVG Chain */}
      <svg
        className="svg-segmented-chain"
        viewBox="0 0 340 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="chainMetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
          <filter id="chainShadow">
            <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#000" floodOpacity="0.95" />
          </filter>
        </defs>

        {/* Interlocked Metallic Chain Links */}
        {[0, 42, 84, 126, 168, 210, 252, 294].map((x, index) => (
          <g key={index} transform={`translate(${x}, 4)`} filter="url(#chainShadow)">
            <rect
              x="2"
              y="4"
              width="36"
              height="26"
              rx="13"
              fill="url(#chainMetalGrad)"
              stroke="#0f172a"
              strokeWidth="2.5"
            />
            <rect x="11" y="12" width="18" height="10" rx="5" fill="#06070a" />
            <line x1="0" y1="17" x2="40" y2="17" stroke="#ff1e27" strokeWidth="2" opacity="0.85" />
          </g>
        ))}
      </svg>

      {/* 3D Metallic Business Name (Positioned Straight in Front: z-index 100) */}
      <div className="brand-title-3d">AE-SIMULATORS</div>
    </div>
  );
}
