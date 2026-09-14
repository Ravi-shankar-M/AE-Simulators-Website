import React from 'react';
import { STAGE_STATES } from '../animations/arrivalTimeline';

export default function AnimatedChain({ state }) {
  const isVisible = [
    STAGE_STATES.CHAIN_TIGHTEN,
    STAGE_STATES.TITLE_DRAG_START,
    STAGE_STATES.CAR_PULL_BOOST,
    STAGE_STATES.MAX_ACCELERATION,
    STAGE_STATES.CAR_EXIT,
    STAGE_STATES.TITLE_SETTLE,
    STAGE_STATES.FINAL_BRAND,
  ].includes(state);

  const isTight = [
    STAGE_STATES.TITLE_DRAG_START,
    STAGE_STATES.CAR_PULL_BOOST,
    STAGE_STATES.MAX_ACCELERATION,
    STAGE_STATES.CAR_EXIT,
  ].includes(state);

  return (
    <div
      className={`animated-chain-wrapper ${isVisible ? 'visible' : ''} ${
        isTight ? 'tight' : ''
      }`}
    >
      {/* Heavy Segmented Interlocked Metallic Chain SVG */}
      <svg
        className="heavy-chain-svg"
        viewBox="0 0 320 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="heavyChainMetal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
          <filter id="chainDropShadow">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.95" />
          </filter>
        </defs>

        {/* Individual Metal Chain Links */}
        {[0, 38, 76, 114, 152, 190, 228, 266].map((x, index) => (
          <g key={index} transform={`translate(${x}, 4)`} filter="url(#chainDropShadow)">
            <rect
              x="2"
              y="4"
              width="34"
              height="24"
              rx="12"
              fill="url(#heavyChainMetal)"
              stroke="#0f172a"
              strokeWidth="2.5"
            />
            <rect x="10" y="11" width="18" height="10" rx="5" fill="#06070a" />
            <line x1="0" y1="16" x2="38" y2="16" stroke="#ff1e27" strokeWidth="2" opacity="0.8" />
          </g>
        ))}
      </svg>
    </div>
  );
}
