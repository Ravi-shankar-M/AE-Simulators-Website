/**
 * THE IGNITION — Timeline Controller & Sound Event Architecture
 * Total Duration: Exactly 8.0 Seconds (8000 milliseconds)
 */

export const IGNITION_STATES = {
  SCENE_1_LOGO: 'SCENE_1_LOGO',
  SCENE_2_CAR_SWEEP: 'SCENE_2_CAR_SWEEP',
  SCENE_3_WORDMARK_REVEAL: 'SCENE_3_WORDMARK_REVEAL',
  SCENE_4_BRAND_HOLD: 'SCENE_4_BRAND_HOLD',
  SCENE_5_TAGLINE_REVEAL: 'SCENE_5_TAGLINE_REVEAL',
  SCENE_6_HOMEPAGE_TRANSITION: 'SCENE_6_HOMEPAGE_TRANSITION',
  COMPLETE: 'COMPLETE',
};

export const IGNITION_TIMINGS = {
  [IGNITION_STATES.SCENE_1_LOGO]: 0,                 // 0.0s — Centered logo + red sweep
  [IGNITION_STATES.SCENE_2_CAR_SWEEP]: 1500,          // 1.5s — Formula car sweep (RIGHT -> LEFT)
  [IGNITION_STATES.SCENE_3_WORDMARK_REVEAL]: 3000,   // 3.0s — Light trail forms AE-SIMULATORS
  [IGNITION_STATES.SCENE_4_BRAND_HOLD]: 4500,        // 4.5s — AE-SIMULATORS metallic hold
  [IGNITION_STATES.SCENE_5_TAGLINE_REVEAL]: 5500,    // 5.5s — DRIVE REAL. TRAIN BETTER.
  [IGNITION_STATES.SCENE_6_HOMEPAGE_TRANSITION]: 6500, // 6.5s — Stage expands into Homepage
  [IGNITION_STATES.COMPLETE]: 8000,                   // 8.0s — Unmounts to reveal Homepage
};

export const IGNITION_SOUND_HOOKS = {
  CAR_PASS: 'CAR_PASS',
  LIGHT_TRAIL: 'LIGHT_TRAIL',
  BRAND_REVEAL: 'BRAND_REVEAL',
  INTRO_COMPLETE: 'INTRO_COMPLETE',
};

export function createIgnitionTimeline({ onStateChange, onComplete, onSoundHook }) {
  let timerIds = [];

  const start = () => {
    const entries = Object.entries(IGNITION_TIMINGS);

    entries.forEach(([state, time]) => {
      const timer = setTimeout(() => {
        onStateChange(state);

        // Sound Architecture Trigger Hooks
        if (state === IGNITION_STATES.SCENE_2_CAR_SWEEP && onSoundHook) {
          onSoundHook(IGNITION_SOUND_HOOKS.CAR_PASS);
        } else if (state === IGNITION_STATES.SCENE_3_WORDMARK_REVEAL && onSoundHook) {
          onSoundHook(IGNITION_SOUND_HOOKS.LIGHT_TRAIL);
        } else if (state === IGNITION_STATES.SCENE_5_TAGLINE_REVEAL && onSoundHook) {
          onSoundHook(IGNITION_SOUND_HOOKS.BRAND_REVEAL);
        } else if (state === IGNITION_STATES.COMPLETE && onSoundHook) {
          onSoundHook(IGNITION_SOUND_HOOKS.INTRO_COMPLETE);
        }

        if (state === IGNITION_STATES.COMPLETE) {
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
