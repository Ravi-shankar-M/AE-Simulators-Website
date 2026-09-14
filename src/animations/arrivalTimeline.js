/**
 * Central Timeline State Machine for THE ARRIVAL Cinematic Intro Stage
 * Total Duration: Exactly 10.0 Seconds (10000 milliseconds)
 */

export const STAGE_STATES = {
  LOGO_CALM: 'LOGO_CALM',
  CAR_ENTRY: 'CAR_ENTRY',
  CAR_APPROACH: 'CAR_APPROACH',
  CHAIN_TIGHTEN: 'CHAIN_TIGHTEN',
  TITLE_DRAG_START: 'TITLE_DRAG_START',
  CAR_PULL_BOOST: 'CAR_PULL_BOOST',
  MAX_ACCELERATION: 'MAX_ACCELERATION',
  CAR_EXIT: 'CAR_EXIT',
  TITLE_SETTLE: 'TITLE_SETTLE',
  FINAL_BRAND: 'FINAL_BRAND',
  COMPLETE: 'COMPLETE',
};

export const STAGE_TIMINGS = {
  [STAGE_STATES.LOGO_CALM]: 0,           // 0.0s — Logo calm inside rectangle
  [STAGE_STATES.CAR_ENTRY]: 1000,        // 1.0s — Car enters from RIGHT
  [STAGE_STATES.CAR_APPROACH]: 2500,     // 2.5s — Car approaches center stage
  [STAGE_STATES.CHAIN_TIGHTEN]: 3200,    // 3.2s — Chain tightens & goes taut
  [STAGE_STATES.TITLE_DRAG_START]: 3800, // 3.8s — Title starts sliding, friction sparks
  [STAGE_STATES.CAR_PULL_BOOST]: 4500,   // 4.5s — Car pulls title, rear wheels spin
  [STAGE_STATES.MAX_ACCELERATION]: 6500, // 6.5s — Max wheel spin & tyre smoke
  [STAGE_STATES.CAR_EXIT]: 7500,         // 7.5s — Car accelerates offstage LEFT
  [STAGE_STATES.TITLE_SETTLE]: 8200,     // 8.2s — Title settles into place
  [STAGE_STATES.FINAL_BRAND]: 9000,      // 9.0s — Final brand moment (~1s hold)
  [STAGE_STATES.COMPLETE]: 10000,        // 10.0s — Reveal Homepage
};

export function createStageTimeline({ onStateChange, onComplete }) {
  let timerIds = [];

  const start = () => {
    const entries = Object.entries(STAGE_TIMINGS);

    entries.forEach(([state, time]) => {
      const timer = setTimeout(() => {
        onStateChange(state);
        if (state === STAGE_STATES.COMPLETE) {
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
