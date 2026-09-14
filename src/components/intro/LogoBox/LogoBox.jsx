import React from 'react';
import { ASSETS } from '../data/assets';
import { ARRIVAL_STATES } from '../animations/arrivalAnimation';
import ProtectedImage from './common/ProtectedImage';

export default function LogoBox({ state, logoSrc = ASSETS.logo.official }) {
  const isShifted = [
    ARRIVAL_STATES.CAR_PUSH,
    ARRIVAL_STATES.CHAIN_REVEAL,
    ARRIVAL_STATES.BRAND_APPEAR,
    ARRIVAL_STATES.ACCELERATION,
    ARRIVAL_STATES.CAR_EXIT,
    ARRIVAL_STATES.TRANSITION,
    ARRIVAL_STATES.FINAL_BRAND,
  ].includes(state);

  const isVisible = state !== ARRIVAL_STATES.INTRO_START;
  const isPushImpact = state === ARRIVAL_STATES.CAR_PUSH;

  return (
    <div
      className={`logo-box-wrapper ${isShifted ? 'shifted-left' : ''} ${
        isPushImpact ? 'camera-shake' : ''
      }`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? isShifted
            ? 'translate(-135%, -50%) rotateY(-8deg)'
            : 'translate(-50%, -50%) scale(1)'
          : 'translate(-50%, -50%) scale(0.7)',
      }}
    >
      <div className="logo-box-frame">
        <div className="logo-box-glass" />
        <ProtectedImage
          src={logoSrc}
          alt="AE Simulators Official Logo"
          className="logo-box-img"
          onError={(e) => {
            console.warn('Logo image path fallback:', logoSrc);
          }}
        />
      </div>
      <div className="logo-box-reflection" />
    </div>
  );
}
