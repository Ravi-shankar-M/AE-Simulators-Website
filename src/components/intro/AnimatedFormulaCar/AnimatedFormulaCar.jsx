import React from 'react';
import { STAGE_STATES } from '../animations/arrivalTimeline';
import TireSmoke from './TireSmoke';

export default function AnimatedFormulaCar({ state }) {
  const getCarTranslateX = () => {
    switch (state) {
      case STAGE_STATES.LOGO_CALM:
        return '100%';
      case STAGE_STATES.CAR_ENTRY:
        return '25%';
      case STAGE_STATES.CAR_APPROACH:
        return '0%'; // Center Stage
      case STAGE_STATES.CHAIN_TIGHTEN:
      case STAGE_STATES.TITLE_DRAG_START:
      case STAGE_STATES.CAR_PULL_BOOST:
      case STAGE_STATES.MAX_ACCELERATION:
        return '-35%'; // Pulling left
      case STAGE_STATES.CAR_EXIT:
      case STAGE_STATES.TITLE_SETTLE:
      case STAGE_STATES.FINAL_BRAND:
      case STAGE_STATES.COMPLETE:
        return '-140%'; // Accelerates offstage left
      default:
        return '100%';
    }
  };

  const isWheelSpinning = [
    STAGE_STATES.CAR_ENTRY,
    STAGE_STATES.CAR_APPROACH,
    STAGE_STATES.CHAIN_TIGHTEN,
    STAGE_STATES.TITLE_DRAG_START,
    STAGE_STATES.CAR_PULL_BOOST,
    STAGE_STATES.MAX_ACCELERATION,
    STAGE_STATES.CAR_EXIT,
  ].includes(state);

  const isAcceleratingHigh = [
    STAGE_STATES.CAR_PULL_BOOST,
    STAGE_STATES.MAX_ACCELERATION,
    STAGE_STATES.CAR_EXIT,
  ].includes(state);

  const getSpinClass = () => {
    if (state === STAGE_STATES.MAX_ACCELERATION || state === STAGE_STATES.CAR_EXIT) {
      return 'spinning-max';
    }
    if (isAcceleratingHigh) {
      return 'spinning-fast';
    }
    if (isWheelSpinning) {
      return 'spinning-slow';
    }
    return '';
  };

  return (
    <div
      className="animated-car-wrapper"
      style={{
        transform: `translateY(-50%) translateX(${getCarTranslateX()})`,
        transition:
          state === STAGE_STATES.MAX_ACCELERATION || state === STAGE_STATES.CAR_EXIT
            ? 'transform 1s cubic-bezier(0.7, 0, 0.3, 1)'
            : 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        className={`animated-car-body ${isAcceleratingHigh ? 'car-squat-pitch' : ''} ${
          isWheelSpinning ? 'car-vibration' : ''
        }`}
      >
        {/* Rear Taillight LED Glow */}
        <div className="car-taillight-glow" />

        {/* Rear Wheel Friction Smoke Generator */}
        {isWheelSpinning && (
          <TireSmoke intensity={isAcceleratingHigh ? 'heavy' : 'slow'} />
        )}

        {/* Matte Black Formula Race Car Vector Construction */}
        <svg
          viewBox="0 0 540 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: 'auto' }}
        >
          <defs>
            <linearGradient id="matteBlackChassis" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="50%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>
            <linearGradient id="redRaceAccent" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff1e27" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>
          </defs>

          {/* Aerodynamic Monocoque Chassis */}
          <path
            d="M35 125 L95 95 L220 78 L370 85 L475 108 L510 125 L475 138 L95 142 Z"
            fill="url(#matteBlackChassis)"
            stroke="#ff1e27"
            strokeWidth="2.5"
          />

          {/* Sidepod & Air Intake with AE Branding */}
          <path d="M190 92 L290 88 L340 105 L220 112 Z" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.5" />
          <path d="M210 94 Q250 82 290 94 Z" fill="url(#redRaceAccent)" />

          {/* Front Wing Assembly */}
          <path d="M460 102 L535 102 L525 135 L450 135 Z" fill="#0f172a" stroke="#ff1e27" strokeWidth="2" />
          <line x1="460" y1="118" x2="530" y2="118" stroke="#ffffff" strokeWidth="2" />

          {/* Rear Wing & Rear Link Anchor */}
          <path d="M20 78 L85 72 L80 122 L15 122 Z" fill="#0f172a" stroke="#cbd5e1" strokeWidth="2" />
          <rect x="25" y="70" width="55" height="12" fill="url(#redRaceAccent)" rx="2" />

          {/* Cockpit & Safety Cell */}
          <path d="M240 78 Q290 55 350 80 Z" fill="#ff1e27" opacity="0.9" />
          <circle cx="280" cy="74" r="8" fill="#cbd5e1" />

          {/* Front Wheel Hub (Steering Axis) */}
          <g transform="translate(115, 130)">
            <circle cx="0" cy="0" r="36" fill="#090d16" stroke="#ff1e27" strokeWidth="3.5" />
            <circle cx="0" cy="0" r="22" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1.5" />
            <g className={`rear-wheel-hub ${getSpinClass()}`}>
              <line x1="-18" y1="0" x2="18" y2="0" stroke="#ffffff" strokeWidth="3" />
              <line x1="0" y1="-18" x2="0" y2="18" stroke="#ffffff" strokeWidth="3" />
              <line x1="-13" y1="-13" x2="13" y2="13" stroke="#ff1e27" strokeWidth="2" />
              <line x1="13" y1="-13" x2="-13" y2="13" stroke="#ff1e27" strokeWidth="2" />
            </g>
          </g>

          {/* Rear Wheel Hub (ROTATING REAR WHEELS) */}
          <g transform="translate(425, 130)">
            <circle cx="0" cy="0" r="40" fill="#090d16" stroke="#ff1e27" strokeWidth="4" />
            <circle cx="0" cy="0" r="24" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1.5" />
            <g className={`rear-wheel-hub ${getSpinClass()}`}>
              <line x1="-20" y1="0" x2="20" y2="0" stroke="#ffffff" strokeWidth="3.5" />
              <line x1="0" y1="-20" x2="0" y2="20" stroke="#ffffff" strokeWidth="3.5" />
              <line x1="-14" y1="-14" x2="14" y2="14" stroke="#ff1e27" strokeWidth="2" />
              <line x1="14" y1="-14" x2="-14" y2="14" stroke="#ff1e27" strokeWidth="2" />
            </g>
          </g>

          {/* AE SIMULATOR Rear Wing & Sidepod Livery */}
          <text x="210" y="106" fill="#FFFFFF" fontSize="15" fontWeight="900" letterSpacing="3">
            AE SIMULATOR
          </text>
        </svg>
      </div>
    </div>
  );
}
