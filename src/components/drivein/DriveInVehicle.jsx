import React from 'react';

export default function DriveInVehicle({ active, showTrail }) {
  return (
    <>
      {/* Automotive Light Painting Trail */}
      <div className={`drivein-light-trail ${showTrail ? 'active' : ''}`} />

      {/* Low Front 3/4 Angle Formula Vehicle Approach */}
      <div className={`drivein-vehicle-layer ${active ? 'active' : ''}`}>
        <svg viewBox="0 0 600 240" width="100%" height="100%" className="drivein-car-svg">
          <defs>
            <linearGradient id="driveinBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="45%" stopColor="#0b0e14" />
              <stop offset="100%" stopColor="#040405" />
            </linearGradient>
            <linearGradient id="driveinRed" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff1e27" />
              <stop offset="100%" stopColor="#e11d24" />
            </linearGradient>
            <linearGradient id="driveinSilver" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
          </defs>

          {/* Rear Wing Structure */}
          <path d="M 40 45 L 120 35 L 130 130 L 50 140 Z" fill="url(#driveinRed)" />
          <path d="M 50 40 L 130 30 L 130 48 L 50 58 Z" fill="url(#driveinSilver)" />

          {/* Main Monocoque Chassis Body (Low Front 3/4 Perspective) */}
          <path
            d="M 110 120 L 240 100 L 420 85 L 530 105 L 540 135 L 420 170 L 240 180 L 110 155 Z"
            fill="url(#driveinBody)"
            stroke="#ff1e27"
            strokeWidth="1.5"
          />

          {/* Aerodynamic Nose Cone */}
          <path d="M 530 105 L 585 120 L 585 130 L 530 135 Z" fill="#475569" />

          {/* Front Wing Assembly */}
          <path d="M 540 65 L 590 70 L 590 180 L 540 185 Z" fill="url(#driveinRed)" />
          <path d="M 550 60 L 590 63 L 590 76 L 550 74 Z" fill="url(#driveinSilver)" />

          {/* Cockpit Halo Safety System */}
          <path d="M 310 92 Q 375 78 405 92 L 405 125 Q 375 140 310 125 Z" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />

          {/* Front & Rear Slick Tyres */}
          <g className="wheel-spin-fast">
            <ellipse cx="130" cy="60" rx="36" ry="26" fill="#090d16" stroke="#64748b" strokeWidth="2" />
            <ellipse cx="130" cy="60" rx="20" ry="15" fill="url(#driveinSilver)" />
          </g>

          <g className="wheel-spin-fast">
            <ellipse cx="165" cy="190" rx="40" ry="28" fill="#090d16" stroke="#64748b" strokeWidth="2" />
            <ellipse cx="165" cy="190" rx="22" ry="16" fill="url(#driveinSilver)" />
          </g>

          <g className="wheel-spin-fast">
            <ellipse cx="480" cy="72" rx="30" ry="22" fill="#090d16" stroke="#64748b" strokeWidth="2" />
            <ellipse cx="480" cy="72" rx="16" ry="12" fill="url(#driveinSilver)" />
          </g>

          <g className="wheel-spin-fast">
            <ellipse cx="500" cy="170" rx="32" ry="24" fill="#090d16" stroke="#64748b" strokeWidth="2" />
            <ellipse cx="500" cy="170" rx="17" ry="13" fill="url(#driveinSilver)" />
          </g>

          {/* Red LED Rear Diffuser Light Glow */}
          <rect x="30" y="88" width="14" height="20" fill="#ff1e27" />
          <circle cx="37" cy="98" r="16" fill="#ff1e27" opacity="0.75" />
        </svg>
      </div>
    </>
  );
}
