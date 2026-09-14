import React from 'react';

export default function VectorFormulaCar({ progress = 0 }) {
  // Calculate Shift Lights (0 to 10 LEDs illuminating sequentially as loading goes 0-100)
  const shiftLightCount = Math.min(10, Math.floor((progress / 100) * 10));

  // Determine Gear Number based on progress percentage
  let gear = 'N';
  if (progress > 5) gear = '1';
  if (progress > 20) gear = '2';
  if (progress > 40) gear = '3';
  if (progress > 60) gear = '4';
  if (progress > 80) gear = '5';
  if (progress >= 98) gear = '6';

  // Calculate RPM (scaled to 9000 max)
  const rpm = Math.floor((progress / 100) * 9000);

  return (
    <div className="console-wrapper-component">
      {/* LED SHIFT LIGHTS BAR AT TOP OF STEERING WHEEL */}
      <div className="shift-lights-bar">
        {Array.from({ length: 10 }).map((_, index) => {
          let colorClass = 'cyan';
          if (index >= 4 && index < 7) colorClass = 'yellow';
          if (index >= 7) colorClass = 'red';
          const isActive = index < shiftLightCount;
          return (
            <div
              key={index}
              className={`shift-light ${colorClass} ${isActive ? 'lit' : ''}`}
            />
          );
        })}
      </div>

      {/* RECTANGULAR GT RACING TELEMETRY CONSOLE SCREEN (ZERO ROUND CIRCLES) */}
      <div className="wheel-hud-wrapper">
        <svg viewBox="0 0 340 180" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="wheelCarbon" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="50%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>

            <linearGradient id="aeRedGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff3b45" />
              <stop offset="50%" stopColor="#ff1e27" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>

            <linearGradient id="screenDisplay" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#030712" />
              <stop offset="100%" stopColor="#091122" />
            </linearGradient>

            <linearGradient id="speedMeterFill" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="60%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#ff1e27" />
            </linearGradient>
          </defs>

          {/* GT FORMULA STEERING FRAME - CRISP RECTANGULAR GEOMETRY */}
          <path d="M 50 38 L 290 38 L 305 130 L 35 130 Z" fill="none" stroke="url(#wheelCarbon)" strokeWidth="26" strokeLinejoin="miter" />
          <path d="M 50 38 L 290 38 L 305 130 L 35 130 Z" fill="none" stroke="#334155" strokeWidth="2" opacity="0.6" />

          {/* Red Alignment Marker */}
          <rect x="164" y="12" width="12" height="12" fill="#ff1e27" rx="1" />

          {/* Carbon Spokes & Hub */}
          <path d="M 90 70 L 250 70 L 222 136 L 118 136 Z" fill="url(#wheelCarbon)" stroke="#ff1e27" strokeWidth="0.8" />

          {/* SHIFT PADDLES */}
          <path d="M 26 62 L 54 52 L 54 94 L 26 84 Z" fill="url(#aeRedGlow)" opacity="0.9" />
          <path d="M 314 62 L 286 52 L 286 94 L 314 84 Z" fill="url(#aeRedGlow)" opacity="0.9" />
          <text x="32" y="76" fontSize="7" fontWeight="900" fill="#ffffff">UP</text>
          <text x="292" y="76" fontSize="7" fontWeight="900" fill="#ffffff">DOWN</text>

          {/* MAIN RECTANGULAR OLED SPEEDOMETER DISPLAY SCREEN */}
          <rect x="95" y="65" width="150" height="70" fill="url(#screenDisplay)" stroke="#ff1e27" strokeWidth="1.5" rx="4" />

          {/* DYNAMIC GEAR BADGE RECTANGLE */}
          <rect x="106" y="80" width="28" height="30" fill="#0f172a" stroke="#ff1e27" strokeWidth="1.2" rx="2" />
          <text x="120" y="102" fontSize="20" fontWeight="900" fill="#ffffff" textAnchor="middle" fontFamily="sans-serif">{gear}</text>

          {/* LINEAR DIGITAL SPEEDOMETER (0 - 100 KM/H) */}
          <text x="185" y="98" fontSize="26" fontWeight="900" fill="#ffffff" fontFamily="monospace" textAnchor="middle">{progress} <tspan fontSize="11" fill="#ff1e27">KM/H</tspan></text>
          <text x="185" y="112" fontSize="8" fontWeight="800" fill="#38bdf8" fontFamily="monospace" textAnchor="middle">{rpm} RPM &bull; FFB 100%</text>

          {/* LINEAR SPEEDOMETER PROGRESS BAR */}
          <rect x="106" y="122" width="128" height="4" fill="#1e293b" rx="1" />
          <rect x="106" y="122" width={Math.max(6, (progress / 100) * 128)} height="4" fill="url(#speedMeterFill)" rx="1" />

          {/* RECTANGULAR SWITCHES */}
          <rect x="110" y="140" width="18" height="10" fill="#ff1e27" rx="1" />
          <text x="119" y="147.5" fontSize="5" fontWeight="900" fill="#ffffff" textAnchor="middle">TC</text>

          <rect x="212" y="140" width="18" height="10" fill="#38bdf8" rx="1" />
          <text x="221" y="147.5" fontSize="5" fontWeight="900" fill="#ffffff" textAnchor="middle">ABS</text>

          {/* CENTER AE METALLIC BADGE */}
          <rect x="156" y="137" width="28" height="14" fill="#0f172a" stroke="#ff1e27" strokeWidth="1.2" rx="2" />
          <text x="170" y="147.5" fontSize="9" fontWeight="900" fill="#ffffff" textAnchor="middle" fontFamily="sans-serif">AE</text>
        </svg>
      </div>
    </div>
  );
}











