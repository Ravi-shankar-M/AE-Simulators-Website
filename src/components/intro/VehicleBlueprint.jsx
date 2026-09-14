import React from 'react';

export default function VehicleBlueprint({ active }) {
  return (
    <div className={`vehicle-blueprint-container ${active ? 'active' : ''}`}>
      <svg className="blueprint-svg" viewBox="0 0 720 240" width="100%" height="100%">
        {/* Chassis Center Line */}
        <line x1="20" y1="120" x2="700" y2="120" stroke="#ff1e27" strokeDasharray="6 4" strokeWidth="1" opacity="0.6" />

        {/* Monocoque Body Outline */}
        <path d="M 120 90 L 260 80 L 460 70 L 600 95 L 600 145 L 460 170 L 260 160 L 120 150 Z" />

        {/* Nose Cone */}
        <path d="M 600 95 L 680 115 L 680 125 L 600 145 Z" />

        {/* Front Wing */}
        <path d="M 650 40 L 700 40 L 700 200 L 650 200 Z" />

        {/* Rear Wing */}
        <path d="M 40 30 L 100 30 L 100 210 L 40 210 Z" />

        {/* Wheels Outline */}
        <rect x="520" y="20" width="90" height="40" rx="6" />
        <rect x="520" y="180" width="90" height="40" rx="6" />
        <rect x="160" y="15" width="110" height="48" rx="8" />
        <rect x="160" y="177" width="110" height="48" rx="8" />

        {/* Suspension Arms Geometry */}
        <line x1="565" y1="60" x2="520" y2="85" />
        <line x1="565" y1="180" x2="520" y2="155" />
        <line x1="215" y1="63" x2="260" y2="80" />
        <line x1="215" y1="177" x2="260" y2="160" />

        {/* Airflow Vector Vectors */}
        <path d="M 690 100 Q 580 60 400 65" stroke="rgba(255,255,255,0.7)" strokeDasharray="4 4" />
        <path d="M 690 140 Q 580 180 400 175" stroke="rgba(255,255,255,0.7)" strokeDasharray="4 4" />
      </svg>
    </div>
  );
}
