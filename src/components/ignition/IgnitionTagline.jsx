import React from 'react';

export default function IgnitionTagline({ active }) {
  return (
    <div className={`ignition-tagline-layer ${active ? 'active' : ''}`}>
      <div className="ignition-tagline-text">DRIVE REAL. TRAIN BETTER.</div>
    </div>
  );
}
