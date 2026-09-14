/**
 * State Machine & Timeline Controller for THE ARRIVAL Cinematic Intro
 * Total Duration: Exactly 7.8 Seconds (7800 milliseconds)
 */

export const ARRIVAL_STATES = {
  INTRO_START: 'INTRO_START',
  LOGO_REVEAL: 'LOGO_REVEAL',
  CAR_ENTRY: 'CAR_ENTRY',
  CAR_REACHES_LOGO: 'CAR_REACHES_LOGO',
  CAR_PUSH: 'CAR_PUSH',
  CHAIN_REVEAL: 'CHAIN_REVEAL',
  BRAND_APPEAR: 'BRAND_APPEAR',
  ACCELERATION: 'ACCELERATION',
  CAR_EXIT: 'CAR_EXIT',
  TRANSITION: 'TRANSITION',
  FINAL_BRAND: 'FINAL_BRAND',
  INTRO_COMPLETE: 'INTRO_COMPLETE',
};

// Exact 7.8-second sequence schedule matching user specification (in milliseconds)
export const STATE_TIMINGS = {
  [ARRIVAL_STATES.INTRO_START]: 0,         // 0.0s — Black screen
  [ARRIVAL_STATES.LOGO_REVEAL]: 500,       // 0.5s — Logo box appears
  [ARRIVAL_STATES.CAR_ENTRY]: 1500,        // 1.5s — Formula car enters from RIGHT
  [ARRIVAL_STATES.CAR_REACHES_LOGO]: 3000, // 3.0s — Car reaches logo
  [ARRIVAL_STATES.CAR_PUSH]: 3200,         // 3.2s — Car pushes logo box LEFT
  [ARRIVAL_STATES.CHAIN_REVEAL]: 4000,     // 4.0s — Chain begins revealing
  [ARRIVAL_STATES.BRAND_APPEAR]: 4800,     // 4.8s — AE-SIMULATORS fully visible
  [ARRIVAL_STATES.ACCELERATION]: 5200,     // 5.2s — Car accelerates LEFT
  [ARRIVAL_STATES.CAR_EXIT]: 6300,         // 6.3s — Car exits
  [ARRIVAL_STATES.TRANSITION]: 6500,       // 6.5s — Red light transition
  [ARRIVAL_STATES.FINAL_BRAND]: 7200,      // 7.2s — Final brand moment
  [ARRIVAL_STATES.INTRO_COMPLETE]: 7800,   // 7.8s — onComplete() -> render Website
};

/**
 * Creates a sequential timeline runner instance
 */
export function createArrivalTimeline({ onStateChange, onComplete }) {
  let timerIds = [];

  const start = () => {
    const stateEntries = Object.entries(STATE_TIMINGS);

    stateEntries.forEach(([state, time]) => {
      const timer = setTimeout(() => {
        onStateChange(state);
        if (state === ARRIVAL_STATES.INTRO_COMPLETE) {
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
