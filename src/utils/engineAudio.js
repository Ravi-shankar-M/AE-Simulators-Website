/**
 * Smooth Twin-Turbo V8 GT Supercar Engine Audio Synthesizer (Web Audio API)
 * Warm, deep, rich engine acceleration pitch driven dynamically by Speed (0 - 100)
 */

class FormulaEngineAudio {
  constructor() {
    this.audioCtx = null;
    this.osc1 = null;
    this.osc2 = null;
    this.oscSub = null;
    this.gainNode = null;
    this.filter = null;
    this.isPlaying = false;
    this.isMuted = false;
  }

  init() {
    if (this.audioCtx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    } catch (e) {
      console.warn('Web Audio API not supported in this browser.', e);
    }
  }

  start() {
    this.init();
    if (!this.audioCtx) return;

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    if (this.isPlaying) return;

    try {
      const now = this.audioCtx.currentTime;

      // Master Volume Gain Node (Smooth Ramping)
      this.gainNode = this.audioCtx.createGain();
      const initialGain = this.isMuted ? 0 : 0.06;
      this.gainNode.gain.setValueAtTime(initialGain, now);

      // Lowpass Resonant Filter (Warm, Deep Exhaust Tone)
      this.filter = this.audioCtx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(450, now);
      this.filter.Q.setValueAtTime(2.0, now);

      // Osc 1: Deep V8 Fundamental Pitch (Triangle Wave)
      this.osc1 = this.audioCtx.createOscillator();
      this.osc1.type = 'triangle';
      this.osc1.frequency.setValueAtTime(55, now);

      // Osc 2: Smooth Engine Harmonic (Sawtooth with soft lowpass)
      this.osc2 = this.audioCtx.createOscillator();
      this.osc2.type = 'sawtooth';
      this.osc2.frequency.setValueAtTime(110, now);

      // Osc Sub: Ultra-deep Low Exhaust Bass (Sine Wave)
      this.oscSub = this.audioCtx.createOscillator();
      this.oscSub.type = 'sine';
      this.oscSub.frequency.setValueAtTime(27.5, now);

      this.osc1.connect(this.filter);
      this.osc2.connect(this.filter);
      this.oscSub.connect(this.gainNode);
      this.filter.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);

      this.osc1.start(now);
      this.osc2.start(now);
      this.oscSub.start(now);
      this.isPlaying = true;
    } catch (e) {
      console.warn('Error starting Formula engine audio:', e);
    }
  }

  ensureStarted() {
    this.start();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  updateSpeed(progress) {
    if (!this.audioCtx) return;
    if (!this.isPlaying) {
      this.start();
    }

    // progress: 0 to 100
    // Deep V8 engine revs smoothly from 55Hz (idle) to 260Hz (warm V8 GT supercar pitch)
    const baseFreq = 55 + (progress / 100) * 205;
    const filterCutoff = 450 + (progress / 100) * 1400;
    const volume = this.isMuted ? 0 : 0.05 + (progress / 100) * 0.12;

    const now = this.audioCtx.currentTime;
    try {
      if (this.osc1) this.osc1.frequency.setTargetAtTime(baseFreq, now, 0.06);
      if (this.osc2) this.osc2.frequency.setTargetAtTime(baseFreq * 2.0, now, 0.06);
      if (this.oscSub) this.oscSub.frequency.setTargetAtTime(baseFreq * 0.5, now, 0.06);
      if (this.filter) this.filter.frequency.setTargetAtTime(filterCutoff, now, 0.06);
      if (this.gainNode) this.gainNode.gain.setTargetAtTime(volume, now, 0.06);
    } catch (e) {
      // Ignore timing updates
    }
  }

  stop() {
    if (!this.isPlaying || !this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      if (this.gainNode) {
        this.gainNode.gain.setTargetAtTime(0, now, 0.08);
      }
      setTimeout(() => {
        try {
          if (this.osc1) this.osc1.stop();
          if (this.osc2) this.osc2.stop();
          if (this.oscSub) this.oscSub.stop();
        } catch (e) {}
        this.isPlaying = false;
      }, 120);
    } catch (e) {
      this.isPlaying = false;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.gainNode && this.audioCtx) {
      const now = this.audioCtx.currentTime;
      this.gainNode.gain.setTargetAtTime(this.isMuted ? 0 : 0.1, now, 0.05);
    }
    return this.isMuted;
  }
}

export const formulaEngineAudio = new FormulaEngineAudio();


