import React from 'react';
import { ASSETS } from '../../data/assets';

export default function FinalBrandFrame({ active }) {
  return (
    <div className={`final-brand-statement ${active ? 'active' : ''}`}>
      <img
        src={ASSETS.logo.official}
        alt="AE Simulators Logo"
        style={{ height: '64px', width: 'auto', marginBottom: '0.8rem' }}
      />
      <h2 className="metallic-title-text" style={{ fontSize: '2.6rem' }}>
        AE-SIMULATORS
      </h2>
      <div className="brand-tagline-sub">DRIVE REAL. TRAIN BETTER.</div>
    </div>
  );
}
