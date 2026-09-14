import React from 'react';

export default function BrandTagline({ active }) {
  return (
    <div className={`brandmotion-tagline-layer ${active ? 'active' : ''}`}>
      <div className="brandmotion-tagline-text">DRIVE REAL. TRAIN BETTER.</div>
    </div>
  );
}
