import React from 'react';

export default function DriveInTagline({ active }) {
  return (
    <div className={`drivein-tagline-layer ${active ? 'active' : ''}`}>
      <div className="drivein-tagline-text">DRIVE REAL. TRAIN BETTER.</div>
    </div>
  );
}
