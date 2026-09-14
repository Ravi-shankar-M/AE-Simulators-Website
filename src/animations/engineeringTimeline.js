/**
 * ENGINEERING COMES ALIVE Timeline Controller
 * Total Duration: Exactly 8.0 Seconds (8000 milliseconds)
 */

export const ENG_STATES = {
  SCENE_01_DARK: 'SCENE_01_DARK',
  SCENE_02_RED_SCAN: 'SCENE_02_RED_SCAN',
  SCENE_03_LOGO_ACTIVATE: 'SCENE_03_LOGO_ACTIVATE',
  SCENE_04_BLUEPRINT: 'SCENE_04_BLUEPRINT',
  SCENE_05_SPEED_PASS: 'SCENE_05_SPEED_PASS',
  SCENE_06_LIGHT_TRAIL: 'SCENE_06_LIGHT_TRAIL',
  SCENE_07_METALLIC_TITLE: 'SCENE_07_METALLIC_TITLE',
  SCENE_08_SIMULATION_OS: 'SCENE_08_SIMULATION_OS',
  SCENE_09_MOTION_HUD: 'SCENE_09_MOTION_HUD',
  SCENE_10_BRAND_STATEMENT: 'SCENE_10_BRAND_STATEMENT',
  SCENE_11_EXPAND_TRANSITION: 'SCENE_11_EXPAND_TRANSITION',
  COMPLETE: 'COMPLETE',
};

export const ENG_TIMINGS = {
  [ENG_STATES.SCENE_01_DARK]: 0,             // 0.0s — Dark stage, red ambient glow
  [ENG_STATES.SCENE_02_RED_SCAN]: 700,       // 0.7s — Red laser scanner line across stage
  [ENG_STATES.SCENE_03_LOGO_ACTIVATE]: 1500, // 1.5s — Logo illuminated + technical HUD
  [ENG_STATES.SCENE_04_BLUEPRINT]: 2200,     // 2.2s — Formula blueprint outline constructs
  [ENG_STATES.SCENE_05_SPEED_PASS]: 3000,    // 3.0s — Formula silhouette pass (RIGHT -> LEFT)
  [ENG_STATES.SCENE_06_LIGHT_TRAIL]: 4000,   // 4.0s — Light trail constructs AE-SIMULATORS
  [ENG_STATES.SCENE_07_METALLIC_TITLE]: 4800,// 4.8s — Metallic silver wordmark
  [ENG_STATES.SCENE_08_SIMULATION_OS]: 5500, // 5.5s — Blueprint -> simulated road lanes
  [ENG_STATES.SCENE_09_MOTION_HUD]: 6200,    // 6.2s — Motion platform actuators & telemetry HUD
  [ENG_STATES.SCENE_10_BRAND_STATEMENT]: 7000, // 7.0s — Final brand + DRIVE REAL. TRAIN BETTER.
  [ENG_STATES.SCENE_11_EXPAND_TRANSITION]: 7600, // 7.6s — Stage expands into Homepage
  [ENG_STATES.COMPLETE]: 8000,               // 8.0s — Complete & reveal Homepage
};

export function createEngineeringTimeline({ onStateChange, onComplete }) {
  let timerIds = [];

  const start = () => {
    const entries = Object.entries(ENG_TIMINGS);

    entries.forEach(([state, time]) => {
      const timer = setTimeout(() => {
        onStateChange(state);
        if (state === ENG_STATES.COMPLETE) {
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
