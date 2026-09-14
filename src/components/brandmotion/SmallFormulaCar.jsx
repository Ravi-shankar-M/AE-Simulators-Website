import React from 'react';

export default function SmallFormulaCar({ active }) {
  return (
    <div className={`small-car-container ${active ? 'active' : ''}`}>
      {/* Subtle Trailing Red Energy Trail */}
      <div className="small-car-light-trail" />

      {/* Sleek Simplified 3/4 Side-Perspective Formula Vector */}
      <svg viewBox="0 0 200 60" width="100%" height="100%">
        <defs>
          <linearGradient id="smallBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="50%" stopColor="#0b0e14" />
            <stop offset="100%" stopColor="#040405" />
          </linearGradient>
          <linearGradient id="smallRed" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff1e27" />
            <stop offset="100%" stopColor="#e11d24" />
          </linearGradient>
          <linearGradient id="smallSilver" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
        </defs>

        {/* Rear Wing */}
        <path d="M 15 15 L 45 12 L 48 38 L 18 40 Z" fill="url(#smallRed)" />
        <path d="M 18 12 L 48 10 L 48 16 L 18 18 Z" fill="url(#smallSilver)" />

        {/* Main Body Chassis */}
        <path
          d="M 40 32 L 85 26 L 145 22 L 182 28 L 185 36 L 145 44 L 85 46 L 40 40 Z"
          fill="url(#smallBody)"
          stroke="#ff1e27"
          strokeWidth="1"
        />

        {/* Aerodynamic Nose */}
        <path d="M 182 28 L 196 32 L 196 35 L 182 36 Z" fill="#64748b" />

        {/* Front Wing */}
        <path d="M 184 18 L 198 20 L 198 48 L 184 50 Z" fill="url(#smallRed)" />

        {/* Cockpit Halo */}
        <path d="M 105 24 Q 130 20 140 24 L 140 32 Q 130 36 105 32 Z" fill="#0f172a" stroke="#cbd5e1" strokeWidth="0.8" />

        {/* Sleek Wheels */}
        <g className="small-wheel-spin">
          <ellipse cx="48" cy="18" rx="12" ry="8" fill="#090d16" stroke="#475569" strokeWidth="1" />
          <ellipse cx="48" cy="18" rx="6" ry="4" fill="url(#smallSilver)" />
        </g>

        <g className="small-wheel-spin">
          <ellipse cx="58" cy="48" rx="14" ry="9" fill="#090d16" stroke="#475569" strokeWidth="1" />
          <ellipse cx="58" cy="48" rx="7" ry="5" fill="url(#smallSilver)" />
        </g>

        <g className="small-wheel-spin">
          <ellipse cx="160" cy="20" rx="10" ry="7" fill="#090d16" stroke="#475569" strokeWidth="1" />
          <ellipse cx="160" cy="20" rx="5" ry="3" fill="url(#smallSilver)" />
        </g>

        <g className="small-wheel-spin">
          <ellipse cx="168" cy="44" rx="11" ry="8" fill="#090d16" stroke="#475569" strokeWidth="1" />
          <ellipse cx="168" cy="44" rx="5" ry="4" fill="url(#smallSilver)" />
        </g>
      </svg>
    </div>
  );
}
