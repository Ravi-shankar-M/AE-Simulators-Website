import React from 'react';

export default function SpeedSilhouettePass({ active, showTrail }) {
  return (
    <>
      {/* Red Motion Light Trail */}
      <div className={`red-motion-light-trail ${showTrail ? 'active' : ''}`} />

      {/* High-Speed Formula Silhouette Sweep */}
      <div className={`speed-silhouette-layer ${active ? 'active' : ''}`}>
        <svg viewBox="0 0 320 90" width="100%" height="100%">
          {/* Formula Silhouette Shape */}
          <path
            d="M 10 50 L 50 35 L 140 25 L 240 40 L 310 48 L 310 58 L 240 65 L 140 70 L 50 65 Z"
            fill="#050505"
            stroke="#ff1e27"
            strokeWidth="2"
          />
          {/* Wheel Blurs */}
          <ellipse cx="60" cy="55" rx="22" ry="14" fill="#ff1e27" opacity="0.8" />
          <ellipse cx="260" cy="52" rx="18" ry="12" fill="#ff1e27" opacity="0.8" />
        </svg>
      </div>
    </>
  );
}
