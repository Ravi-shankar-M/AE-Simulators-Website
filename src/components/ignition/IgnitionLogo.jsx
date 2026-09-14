import React from 'react';
import { ASSETS } from '../../data/assets';

export default function IgnitionLogo({ active, isDimmed, isHidden }) {
  return (
    <div className={`ignition-logo-layer ${isDimmed ? 'dimmed' : ''} ${isHidden ? 'hidden' : ''}`}>
      <img
        src={ASSETS.logo.official}
        alt="AE Simulators Official Logo"
        className="ignition-brand-img"
      />
    </div>
  );
}
