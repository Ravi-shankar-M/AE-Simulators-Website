import React from 'react';

export default function IgnitionFormulaCar({ active, showTrail }) {
  return (
    <>
      {/* Red Motion Light Trail */}
      <div className={`ignition-light-trail ${showTrail ? 'active' : ''}`} />

      {/* 3/4 Front Low Angle Hero Formula Vehicle */}
      <div className={`ignition-car-hero-34 ${active ? 'active' : ''}`}>
        <svg viewBox="0 0 540 220" width="100%" height="100%" className="car-34-svg">
          <defs>
            <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="40%" stopColor="#0b0e14" />
              <stop offset="100%" stopColor="#050505" />
            </linearGradient>
            <linearGradient id="redAccentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff1e27" />
              <stop offset="100%" stopColor="#e11d24" />
            </linearGradient>
            <linearGradient id="metallicSilver" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>

            {/* Environmental Light Streak Reflection Overlay */}
            <linearGradient id="streakReflection" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="50%" stopColor="rgba(255,30,39,0.85)" />
              <stop offset="70%" stopColor="rgba(255,255,255,0.95)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>

          {/* Rear Wing Structure (3/4 Low Angle) */}
          <path d="M 40 40 L 110 30 L 120 120 L 50 130 Z" fill="url(#redAccentGrad)" />
          <path d="M 50 35 L 120 25 L 120 40 L 50 50 Z" fill="url(#metallicSilver)" />

          {/* Main Carbon Chassis Body */}
          <path
            d="M 100 110 L 220 90 L 380 75 L 480 95 L 490 125 L 380 155 L 220 165 L 100 145 Z"
            fill="url(#bodyGrad)"
            stroke="#ff1e27"
            strokeWidth="1.5"
          />

          {/* Aerodynamic Nose Cone (3/4 Low Angle) */}
          <path d="M 480 95 L 530 110 L 530 120 L 480 125 Z" fill="#334155" />

          {/* Front Wing Assembly */}
          <path d="M 490 60 L 535 65 L 535 165 L 490 170 Z" fill="url(#redAccentGrad)" />
          <path d="M 500 55 L 535 58 L 535 70 L 500 68 Z" fill="url(#metallicSilver)" />

          {/* Cockpit Halo Safety System */}
          <path d="M 280 85 Q 340 70 370 85 L 370 115 Q 340 130 280 115 Z" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />

          {/* Environmental Specular Light Reflection Overlay across Panels */}
          <path
            d="M 490 60 L 535 65 L 535 70 L 490 68 Z"
            fill="url(#streakReflection)"
            className="panel-light-reflection-sweep"
          />
          <path
            d="M 220 90 L 380 75 L 380 95 L 220 110 Z"
            fill="url(#streakReflection)"
            className="panel-light-reflection-sweep"
          />

          {/* 3/4 Perspective Wheels */}
          <g className="wheel-assembly">
            <ellipse cx="120" cy="55" rx="32" ry="24" fill="#090d16" stroke="#475569" strokeWidth="2" />
            <ellipse cx="120" cy="55" rx="18" ry="14" fill="url(#metallicSilver)" />
          </g>

          <g className="wheel-assembly">
            <ellipse cx="150" cy="175" rx="36" ry="26" fill="#090d16" stroke="#475569" strokeWidth="2" />
            <ellipse cx="150" cy="175" rx="20" ry="15" fill="url(#metallicSilver)" />
          </g>

          <g className="wheel-assembly">
            <ellipse cx="440" cy="65" rx="28" ry="20" fill="#090d16" stroke="#475569" strokeWidth="2" />
            <ellipse cx="440" cy="65" rx="15" ry="11" fill="url(#metallicSilver)" />
          </g>

          <g className="wheel-assembly">
            <ellipse cx="460" cy="155" rx="30" ry="22" fill="#090d16" stroke="#475569" strokeWidth="2" />
            <ellipse cx="460" cy="155" rx="16" ry="12" fill="url(#metallicSilver)" />
          </g>

          {/* Red LED Taillight Glow */}
          <rect x="35" y="80" width="12" height="18" fill="#ff1e27" />
          <circle cx="41" cy="89" r="14" fill="#ff1e27" opacity="0.65" />
        </svg>
      </div>
    </>
  );
}
