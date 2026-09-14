/**
 * Centralized 3D Animation Timeline Controller for THE ARRIVAL 3D Intro
 * Total Duration: Exactly 10.0 Seconds (10000 milliseconds)
 */

export const SIMULATOR_3D_STATES = {
  LOGO_CALM: 'LOGO_CALM',
  CAR_ENTRY: 'CAR_ENTRY',
  CAR_APPROACH: 'CAR_APPROACH',
  CHAIN_TENSION: 'CHAIN_TENSION',
  TITLE_DRAG_START: 'TITLE_DRAG_START',
  CAR_ACCELERATE: 'CAR_ACCELERATE',
  MAX_ACCELERATION: 'MAX_ACCELERATION',
  CAR_EXIT: 'CAR_EXIT',
  TITLE_SETTLE: 'TITLE_SETTLE',
  FINAL_BRAND: 'FINAL_BRAND',
  COMPLETE: 'COMPLETE',
};

export const SIMULATOR_3D_TIMINGS = {
  [SIMULATOR_3D_STATES.LOGO_CALM]: 0,           // 0.0s — Logo calm, 3D scene dark
  [SIMULATOR_3D_STATES.CAR_ENTRY]: 1000,        // 1.0s — 3D Car enters from right (+X)
  [SIMULATOR_3D_STATES.CAR_APPROACH]: 2500,     // 2.5s — Car approaches center stage
  [SIMULATOR_3D_STATES.CHAIN_TENSION]: 3500,    // 3.5s — 3D Chain goes taut
  [SIMULATOR_3D_STATES.TITLE_DRAG_START]: 4000, // 4.0s — Title resists & starts sliding
  [SIMULATOR_3D_STATES.CAR_ACCELERATE]: 5000,   // 5.0s — Car accelerates left, wheels spin fast
  [SIMULATOR_3D_STATES.MAX_ACCELERATION]: 7000, // 7.0s — Max acceleration + tyre smoke & sparks
  [SIMULATOR_3D_STATES.CAR_EXIT]: 8000,         // 8.0s — 3D Car accelerates offstage left (-X)
  [SIMULATOR_3D_STATES.TITLE_SETTLE]: 8800,     // 8.8s — 3D Title settles in place
  [SIMULATOR_3D_STATES.FINAL_BRAND]: 9500,      // 9.5s — Final brand frame hold (~0.5s)
  [SIMULATOR_3D_STATES.COMPLETE]: 10000,        // 10.0s — Unmounts 3D stage and reveals Homepage
};

export function createSimulator3DTimeline({ onStateChange, onComplete }) {
  let timerIds = [];

  const start = () => {
    const entries = Object.entries(SIMULATOR_3D_TIMINGS);

    entries.forEach(([state, time]) => {
      const timer = setTimeout(() => {
        onStateChange(state);
        if (state === SIMULATOR_3D_STATES.COMPLETE) {
          onComplete();
        }
      }, time);
      timerIds.push(timer);
    });

    return stop;
  };

  const stop = () => {
    timerIds.forEach((id) => clearTimeout(id));
    timerIds = [];
  };

  return { start, stop };
}
