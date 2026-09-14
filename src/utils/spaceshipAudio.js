/**
 * High-Tech Futuristic Device Booting & Power-On System Audio Synthesizer (Web Audio API)
 * Synthesizes an iconic device startup chime, ascending power-grid ramp, and system ready completion chime.
 */

class DeviceBootAudioSynthesizer {
  constructor() {
    this.audioCtx = null;
    this.oscBootSub = null;
    this.oscBootChime = null;
    this.oscPowerGrid = null;
    this.gainNode = null;
    this.filter = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.bootChimePlayed = false;
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

      // Master Gain Control (Smooth Ramping)
      this.gainNode = this.audioCtx.createGain();
      const initialGain = this.isMuted ? 0 : 0.09;
      this.gainNode.gain.setValueAtTime(initialGain, now);

      // Resonant Lowpass Filter for Futuristic Electronics
      this.filter = this.audioCtx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(450, now);
      this.filter.Q.setValueAtTime(3.5, now);

      // Sub-Bass Power Transformer Tone (Sine)
      this.oscBootSub = this.audioCtx.createOscillator();
      this.oscBootSub.type = 'sine';
      this.oscBootSub.frequency.setValueAtTime(60, now);

      // Mid Power-Grid Whine (Triangle)
      this.oscPowerGrid = this.audioCtx.createOscillator();
      this.oscPowerGrid.type = 'triangle';
      this.oscPowerGrid.frequency.setValueAtTime(120, now);

      // High Harmonic Crystal Chime (Sine)
      this.oscBootChime = this.audioCtx.createOscillator();
      this.oscBootChime.type = 'sine';
      this.oscBootChime.frequency.setValueAtTime(261.63, now); // C4

      this.oscBootSub.connect(this.gainNode);
      this.oscPowerGrid.connect(this.filter);
      this.oscBootChime.connect(this.filter);
      this.filter.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);

      this.oscBootSub.start(now);
      this.oscPowerGrid.start(now);
      this.oscBootChime.start(now);
      this.isPlaying = true;

      // Play Iconic Ascending Device Boot Chime Arpeggio (C4 -> G4 -> C5 -> E5)
      this.playBootChimeSequence(now);
    } catch (e) {
      console.warn('Error starting Device Boot audio:', e);
    }
  }

  playBootChimeSequence(startTime) {
    if (!this.audioCtx || this.bootChimePlayed) return;
    this.bootChimePlayed = true;

    const notes = [261.63, 392.00, 523.25, 659.25]; // C4 -> G4 -> C5 -> E5
    notes.forEach((freq, idx) => {
      const noteTime = startTime + idx * 0.15;
      if (this.oscBootChime) {
        this.oscBootChime.frequency.setValueAtTime(freq, noteTime);
      }
    });
  }

  ensureStarted() {
    this.start();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  updateProgress(progress) {
    if (!this.audioCtx) return;
    if (!this.isPlaying) {
      this.start();
    }

    // Device power-grid ramps pitch smoothly from 120Hz up to 440Hz
    const gridFreq = 120 + (progress / 100) * 320;
    const subFreq = 50 + (progress / 100) * 110;
    const filterCutoff = 450 + (progress / 100) * 3200;
    const volume = this.isMuted ? 0 : 0.08 + (progress / 100) * 0.14;

    const now = this.audioCtx.currentTime;
    try {
      if (this.oscBootSub) this.oscBootSub.frequency.setTargetAtTime(subFreq, now, 0.05);
      if (this.oscPowerGrid) this.oscPowerGrid.frequency.setTargetAtTime(gridFreq, now, 0.05);
      if (this.filter) this.filter.frequency.setTargetAtTime(filterCutoff, now, 0.05);
      if (this.gainNode) this.gainNode.gain.setTargetAtTime(volume, now, 0.05);

      // System Ready Completion Chime at 100%
      if (progress >= 99 && !this.completedChimePlayed) {
        this.playCompletionChime(now);
      }
    } catch (e) {
      // Ignore timing updates
    }
  }

  playCompletionChime(now) {
    if (!this.audioCtx || this.completedChimePlayed) return;
    this.completedChimePlayed = true;

    try {
      const oscDone = this.audioCtx.createOscillator();
      const gainDone = this.audioCtx.createGain();
      oscDone.type = 'sine';
      oscDone.frequency.setValueAtTime(880, now); // A5 System Ready
      oscDone.frequency.exponentialRampToValueAtTime(1760, now + 0.25); // A6

      gainDone.gain.setValueAtTime(0.2, now);
      gainDone.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      oscDone.connect(gainDone);
      gainDone.connect(this.audioCtx.destination);

      oscDone.start(now);
      oscDone.stop(now + 0.6);
    } catch (e) {}
  }

  stop() {
    if (!this.isPlaying || !this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      if (this.gainNode) {
        this.gainNode.gain.setTargetAtTime(0, now, 0.1);
      }
      setTimeout(() => {
        try {
          if (this.oscBootSub) this.oscBootSub.stop();
          if (this.oscPowerGrid) this.oscPowerGrid.stop();
          if (this.oscBootChime) this.oscBootChime.stop();
        } catch (e) {}
        this.isPlaying = false;
        this.bootChimePlayed = false;
        this.completedChimePlayed = false;
      }, 150);
    } catch (e) {
      this.isPlaying = false;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.gainNode && this.audioCtx) {
      const now = this.audioCtx.currentTime;
      this.gainNode.gain.setTargetAtTime(this.isMuted ? 0 : 0.12, now, 0.05);
    }
    return this.isMuted;
  }
}

export const spaceshipAudio = new DeviceBootAudioSynthesizer();
