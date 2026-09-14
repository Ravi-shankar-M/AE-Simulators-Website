/**
 * THE BRAND AS HERO — Timeline Controller
 * Total Duration: Exactly 7.5 Seconds (7500 milliseconds)
 */

export const BRANDMOTION_STATES = {
  SCENE_1_LOGO_INIT: 'SCENE_1_LOGO_INIT',
  SCENE_2_LIGHT_SWEEP: 'SCENE_2_LIGHT_SWEEP',
  SCENE_3_CAR_DRIVE: 'SCENE_3_CAR_DRIVE',
  SCENE_4_CAR_EXIT: 'SCENE_4_CAR_EXIT',
  SCENE_5_FINAL_BRAND: 'SCENE_5_FINAL_BRAND',
  SCENE_6_EXPAND_TRANSITION: 'SCENE_6_EXPAND_TRANSITION',
  COMPLETE: 'COMPLETE',
};

export const BRANDMOTION_TIMINGS = {
  [BRANDMOTION_STATES.SCENE_1_LOGO_INIT]: 0,           // 0.0s — Fixed logo + wordmark silhouette
  [BRANDMOTION_STATES.SCENE_2_LIGHT_SWEEP]: 1000,      // 1.0s — Wordmark light sweep + small car appears
  [BRANDMOTION_STATES.SCENE_3_CAR_DRIVE]: 2000,        // 2.0s — Small car drives RIGHT -> LEFT (2.5s)
  [BRANDMOTION_STATES.SCENE_4_CAR_EXIT]: 4500,         // 4.5s — Small car exits offstage left
  [BRANDMOTION_STATES.SCENE_5_FINAL_BRAND]: 5500,      // 5.5s — Final brand frame + DRIVE REAL. TRAIN BETTER.
  [BRANDMOTION_STATES.SCENE_6_EXPAND_TRANSITION]: 6500,// 6.5s — Stage expands into Homepage
  [BRANDMOTION_STATES.COMPLETE]: 7500,                 // 7.5s — Unmounts to reveal Homepage
};

export function createBrandMotionTimeline({ onStateChange, onComplete, onSoundHook }) {
  let timerIds = [];

  const start = () => {
    const entries = Object.entries(BRANDMOTION_TIMINGS);

    entries.forEach(([state, time]) => {
      const timer = setTimeout(() => {
        onStateChange(state);

        if (state === BRANDMOTION_STATES.SCENE_2_LIGHT_SWEEP && onSoundHook) {
          onSoundHook('LIGHT_SWEEP');
        } else if (state === BRANDMOTION_STATES.SCENE_3_CAR_DRIVE && onSoundHook) {
          onSoundHook('SMALL_CAR_PASS');
        } else if (state === BRANDMOTION_STATES.COMPLETE && onSoundHook) {
          onSoundHook('INTRO_COMPLETE');
        }

        if (state === BRANDMOTION_STATES.COMPLETE) {
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
