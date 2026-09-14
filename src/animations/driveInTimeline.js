/**
 * THE DRIVE-IN — Timeline Controller & Sound Event Architecture
 * Total Duration: Exactly 10.0 Seconds (10000 milliseconds)
 */

export const DRIVEIN_STATES = {
  SCENE_1_DARK: 'SCENE_1_DARK',
  SCENE_2_DISTANT_CAR: 'SCENE_2_DISTANT_CAR',
  SCENE_3_APPROACH: 'SCENE_3_APPROACH',
  SCENE_4_LARGE_FOREGROUND: 'SCENE_4_LARGE_FOREGROUND',
  SCENE_5_HERO_HOLD: 'SCENE_5_HERO_HOLD',
  SCENE_6_HIGH_SPEED_PASS: 'SCENE_6_HIGH_SPEED_PASS',
  SCENE_7_LIGHT_TRAIL: 'SCENE_7_LIGHT_TRAIL',
  SCENE_8_WORDMARK_CONSTRUCT: 'SCENE_8_WORDMARK_CONSTRUCT',
  SCENE_9_LIGHT_SWEEP: 'SCENE_9_LIGHT_SWEEP',
  SCENE_10_TAGLINE: 'SCENE_10_TAGLINE',
  SCENE_11_BRAND_FRAME: 'SCENE_11_BRAND_FRAME',
  SCENE_12_STAGE_EXPAND: 'SCENE_12_STAGE_EXPAND',
  COMPLETE: 'COMPLETE',
};

export const DRIVEIN_TIMINGS = {
  [DRIVEIN_STATES.SCENE_1_DARK]: 0,                 // 0.0s — Dark asphalt floor + fixed logo
  [DRIVEIN_STATES.SCENE_2_DISTANT_CAR]: 800,         // 0.8s — Distant car appears
  [DRIVEIN_STATES.SCENE_3_APPROACH]: 1500,          // 1.5s — Perspective approach (DISTANCE -> MIDGROUND)
  [DRIVEIN_STATES.SCENE_4_LARGE_FOREGROUND]: 3000,   // 3.0s — Expands to 85% width
  [DRIVEIN_STATES.SCENE_5_HERO_HOLD]: 3800,         // 3.8s — Close-up hero hold (~0.8s)
  [DRIVEIN_STATES.SCENE_6_HIGH_SPEED_PASS]: 4600,    // 4.6s — High-speed pass sweep
  [DRIVEIN_STATES.SCENE_7_LIGHT_TRAIL]: 5200,       // 5.2s — Automotive light trail
  [DRIVEIN_STATES.SCENE_8_WORDMARK_CONSTRUCT]: 6200,// 6.2s — Light trail constructs AE-SIMULATORS
  [DRIVEIN_STATES.SCENE_9_LIGHT_SWEEP]: 7000,       // 7.0s — Left-to-right specular sweep
  [DRIVEIN_STATES.SCENE_10_TAGLINE]: 7500,          // 7.5s — DRIVE REAL. TRAIN BETTER.
  [DRIVEIN_STATES.SCENE_11_BRAND_FRAME]: 8200,      // 8.2s — Final brand frame hold
  [DRIVEIN_STATES.SCENE_12_STAGE_EXPAND]: 9200,     // 9.2s — Stage expands into Homepage
  [DRIVEIN_STATES.COMPLETE]: 10000,                 // 10.0s — Unmounts to reveal Homepage
};

export function createDriveInTimeline({ onStateChange, onComplete, onSoundHook }) {
  let timerIds = [];

  const start = () => {
    const entries = Object.entries(DRIVEIN_TIMINGS);

    entries.forEach(([state, time]) => {
      const timer = setTimeout(() => {
        onStateChange(state);

        if (state === DRIVEIN_STATES.SCENE_3_APPROACH && onSoundHook) {
          onSoundHook('ENGINE_APPROACH');
        } else if (state === DRIVEIN_STATES.SCENE_6_HIGH_SPEED_PASS && onSoundHook) {
          onSoundHook('SPEED_PASS_SWEEP');
        } else if (state === DRIVEIN_STATES.SCENE_8_WORDMARK_CONSTRUCT && onSoundHook) {
          onSoundHook('WORDMARK_CONSTRUCT');
        } else if (state === DRIVEIN_STATES.COMPLETE && onSoundHook) {
          onSoundHook('INTRO_COMPLETE');
        }

        if (state === DRIVEIN_STATES.COMPLETE) {
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
