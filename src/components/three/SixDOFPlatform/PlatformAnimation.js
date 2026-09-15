/**
 * Scroll phase mapping for the cinematic 6-DOF platform experience.
 * Flow: Intro → Disassembly → Engineering → Reassembly → Motion Demo → Applications
 */

export const SCROLL_PHASES = {
  INTRO: { start: 0, end: 0.12, id: 'intro', label: '01 / 06' },
  DISASSEMBLY: { start: 0.12, end: 0.38, id: 'disassembly', label: '02 / 06' },
  ENGINEERING: { start: 0.38, end: 0.52, id: 'engineering', label: '03 / 06' },
  REASSEMBLY: { start: 0.52, end: 0.72, id: 'reassembly', label: '04 / 06' },
  MOTION_DEMO: { start: 0.72, end: 0.88, id: 'motion', label: '05 / 06' },
  APPLICATIONS: { start: 0.88, end: 1.0, id: 'applications', label: '06 / 06' },
};

const PHASE_ORDER = [
  SCROLL_PHASES.INTRO,
  SCROLL_PHASES.DISASSEMBLY,
  SCROLL_PHASES.ENGINEERING,
  SCROLL_PHASES.REASSEMBLY,
  SCROLL_PHASES.MOTION_DEMO,
  SCROLL_PHASES.APPLICATIONS,
];

function clamp(value, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function phaseLocalProgress(progress, phase) {
  if (progress <= phase.start) return 0;
  if (progress >= phase.end) return 1;
  return (progress - phase.start) / (phase.end - phase.start);
}

/** Resolve which narrative phase the user is in (0–5). */
export function getScrollPhase(progress) {
  const p = clamp(progress);
  for (let i = PHASE_ORDER.length - 1; i >= 0; i -= 1) {
    if (p >= PHASE_ORDER[i].start) return PHASE_ORDER[i];
  }
  return SCROLL_PHASES.INTRO;
}

/**
 * Assembly factor: 1 = fully assembled, 0 = fully disassembled.
 * Reversible — scrolling up reverses the animation.
 */
export function getAssemblyProgress(progress) {
  const p = clamp(progress);

  if (p <= SCROLL_PHASES.INTRO.end) return 1;
  if (p <= SCROLL_PHASES.DISASSEMBLY.end) {
    return lerp(1, 0, phaseLocalProgress(p, SCROLL_PHASES.DISASSEMBLY));
  }
  if (p <= SCROLL_PHASES.ENGINEERING.end) return 0;
  if (p <= SCROLL_PHASES.REASSEMBLY.end) {
    return lerp(0, 1, phaseLocalProgress(p, SCROLL_PHASES.REASSEMBLY));
  }
  return 1;
}

/** Per-component assembly offsets derived from assembly progress. */
export function getComponentOffsets(assemblyProgress) {
  const ap = clamp(assemblyProgress);
  const inv = 1 - ap;

  return {
    motorRadOffset: inv * 0.85,
    jointHorizOffset: inv * 0.75,
    pistonRetractOffset: inv * 0.45,
    topPlatformYOffset: 0.95 + inv * 0.85,
    actuatorSpread: inv * 0.18,
  };
}

export const STAGE_CONTENT = {
  intro: {
    headline: '6-DOF HEXAPOD MOTION PLATFORM',
    subtext: 'Industrial-grade electromechanical motion system — engineered for precision simulation, not entertainment.',
    counter: '01 / 06',
  },
  disassembly: {
    headline: 'COMPONENT DISASSEMBLY',
    subtext: 'Six precision linear actuators, universal joints, and control electronics — each engineered for high-dynamic response.',
    counter: '02 / 06',
  },
  engineering: {
    headline: 'PRECISION ENGINEERING',
    subtext: 'Real-time inverse kinematics, washout filtering, and sub-millimeter actuator positioning across all six degrees of freedom.',
    counter: '03 / 06',
  },
  reassembly: {
    headline: 'SYSTEM INTEGRATION',
    subtext: 'Components lock into 6-DOF hexapod geometry — delivering full spatial motion capability for immersive simulation.',
    counter: '04 / 06',
  },
  motion: {
    headline: '6 DEGREES OF FREEDOM',
    subtext: 'Roll, pitch, yaw, surge, sway, and heave — translating vehicle dynamics into physical chassis motion.',
    counter: '05 / 06',
  },
  applications: {
    headline: 'MULTI-INDUSTRY SIMULATION',
    subtext: 'Motion platforms deployed across driver training, automotive R&D, research institutions, and custom engineering applications.',
    counter: '06 / 06',
  },
};

export const ENGINEERING_LABELS = [
  { id: 'actuation', text: 'PRECISION ACTUATION', angle: -0.4, radius: 2.1, y: 0.55 },
  { id: 'control', text: 'REAL-TIME CONTROL', angle: 0.6, radius: 2.0, y: 0.35 },
  { id: 'motion', text: 'MOTION SYSTEM', angle: 2.1, radius: 2.15, y: 0.5 },
  { id: 'architecture', text: '6-DOF ARCHITECTURE', angle: -2.0, radius: 1.95, y: 0.65 },
  { id: 'simulation', text: 'SIMULATION TECHNOLOGY', angle: 1.2, radius: 2.05, y: 0.75 },
];

/** Label opacity peaks during engineering phase, fades at other phases. */
export function getEngineeringLabelOpacity(progress) {
  const p = clamp(progress);
  const eng = SCROLL_PHASES.ENGINEERING;
  const dis = SCROLL_PHASES.DISASSEMBLY;
  const rea = SCROLL_PHASES.REASSEMBLY;

  if (p >= eng.start && p <= eng.end) {
    const local = phaseLocalProgress(p, eng);
    const fadeIn = Math.min(local * 4, 1);
    const fadeOut = local > 0.75 ? 1 - (local - 0.75) / 0.25 : 1;
    return fadeIn * fadeOut;
  }
  if (p > dis.start + (dis.end - dis.start) * 0.6 && p < eng.start) {
    return (p - (dis.start + (dis.end - dis.start) * 0.6)) / (eng.start - (dis.start + (dis.end - dis.start) * 0.6));
  }
  if (p > eng.end && p < rea.end) {
    return 1 - phaseLocalProgress(p, rea);
  }
  return 0;
}

export const APPLICATION_CATEGORIES = [
  { id: 'training', label: 'DRIVER TRAINING', tag: 'Professional Certification' },
  { id: 'automotive', label: 'AUTOMOTIVE R&D', tag: 'Driver-in-the-Loop Testing' },
  { id: 'research', label: 'RESEARCH & DEVELOPMENT', tag: 'Human Factors & ADAS' },
  { id: 'industrial', label: 'INDUSTRIAL SIMULATION', tag: '3-DOF & 6-DOF Motion' },
  { id: 'institutional', label: 'INSTITUTIONAL TRAINING', tag: 'Standardized Assessment' },
  { id: 'custom', label: 'CUSTOM SOLUTIONS', tag: 'Client-Specific Builds' },
];

export function getApplicationsOpacity(progress) {
  const p = clamp(progress);
  if (p < SCROLL_PHASES.APPLICATIONS.start) return 0;
  return phaseLocalProgress(p, SCROLL_PHASES.APPLICATIONS);
}
