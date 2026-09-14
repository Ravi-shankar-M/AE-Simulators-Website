import React from 'react';
import { ASSETS } from '../data/assets';

export default function IntroLogoBox({ state }) {
  return (
    <div className="stage-billboard-box">
      <img
        src={ASSETS.logo.official}
        alt="AE Simulators Official Logo"
        className="billboard-logo-img"
      />
      <div className="billboard-tagline">TOMORROW'S SOLUTION TODAY</div>
    </div>
  );
}
