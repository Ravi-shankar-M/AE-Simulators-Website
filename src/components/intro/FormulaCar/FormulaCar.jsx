import React from 'react';
import { ARRIVAL_STATES } from '../animations/arrivalAnimation';
import aeFormulaCarImg from '../Simulators/sections/MotionPlatform/images/ae-formula-car.png';

export default function FormulaCar({ state }) {
  const getCarTranslateX = () => {
    switch (state) {
      case ARRIVAL_STATES.INTRO_START:
      case ARRIVAL_STATES.LOGO_REVEAL:
        return '100vw';
      case ARRIVAL_STATES.CAR_ENTRY:
      case ARRIVAL_STATES.CAR_REACHES_LOGO:
        return '0vw';
      case ARRIVAL_STATES.CAR_PUSH:
      case ARRIVAL_STATES.CHAIN_REVEAL:
      case ARRIVAL_STATES.BRAND_APPEAR:
        return '-35vw';
      case ARRIVAL_STATES.ACCELERATION:
      case ARRIVAL_STATES.CAR_EXIT:
      case ARRIVAL_STATES.TRANSITION:
      case ARRIVAL_STATES.FINAL_BRAND:
      case ARRIVAL_STATES.INTRO_COMPLETE:
        return '-140vw';
      default:
        return '100vw';
    }
  };

  const isTyreSmoking = [
    ARRIVAL_STATES.CAR_ENTRY,
    ARRIVAL_STATES.CAR_REACHES_LOGO,
    ARRIVAL_STATES.CAR_PUSH,
    ARRIVAL_STATES.CHAIN_REVEAL,
    ARRIVAL_STATES.BRAND_APPEAR,
    ARRIVAL_STATES.ACCELERATION,
  ].includes(state);

  return (
    <div className="formula-car-stage">
      <div
        className="formula-car-body"
        style={{
          transform: `translateX(${getCarTranslateX()})`,
          transition:
            state === ARRIVAL_STATES.ACCELERATION || state === ARRIVAL_STATES.CAR_EXIT
              ? 'transform 1s cubic-bezier(0.7, 0, 0.3, 1)'
              : 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {isTyreSmoking && (
          <div className="tyre-smoke-container">
            <div className="tyre-smoke-puff front-wheel-smoke" />
            <div className="tyre-smoke-puff rear-wheel-smoke" />
          </div>
        )}

        <img
          src={aeFormulaCarImg}
          alt="AE-Simulators Realistic Formula Vehicle"
          className="formula-car-img"
        />
      </div>
    </div>
  );
}
