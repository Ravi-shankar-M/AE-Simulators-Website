/**
 * Modular Sound Event Hooks for THE ARRIVAL 3D Cinematic Intro
 * Prepared for optional Web Audio API / HTML5 Audio SFX triggers
 */

export const SOUND_EVENTS = {
  INTRO_START: 'INTRO_START',
  CAR_ENGINE: 'CAR_ENGINE',
  TYRE_SPIN: 'TYRE_SPIN',
  CHAIN_TENSION: 'CHAIN_TENSION',
  TITLE_DRAG: 'TITLE_DRAG',
  ACCELERATION: 'ACCELERATION',
  CAR_EXIT: 'CAR_EXIT',
  INTRO_COMPLETE: 'INTRO_COMPLETE',
};

// Registered listener callbacks
const listeners = new Set();

export function triggerSoundEvent(event, data = {}) {
  // Silent execution hook - ready for audio assets
  listeners.forEach((listener) => {
    try {
      listener(event, data);
    } catch (e) {
      console.warn('Sound event listener error:', e);
    }
  });
}

export function subscribeSoundEvents(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}
