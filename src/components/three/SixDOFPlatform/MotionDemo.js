/**
 * 6-DOF motion demonstration — scroll-driven kinematic offsets.
 * Values are illustrative visual representations, not specifications.
 */

export const DOF_SEQUENCE = ['ROLL', 'PITCH', 'YAW', 'SURGE', 'SWAY', 'HEAVE'];

export const DOF_INFO = {
  ROLL: { label: 'ROLL', axis: 'X', desc: 'Longitudinal axis rotation' },
  PITCH: { label: 'PITCH', axis: 'Y', desc: 'Lateral axis rotation' },
  YAW: { label: 'YAW', axis: 'Z', desc: 'Vertical axis rotation' },
  SURGE: { label: 'SURGE', axis: 'X', desc: 'Longitudinal displacement' },
  SWAY: { label: 'SWAY', axis: 'Y', desc: 'Lateral displacement' },
  HEAVE: { label: 'HEAVE', axis: 'Z', desc: 'Vertical displacement' },
};

const DOF_MOTIONS = {
  ROLL: { rotX: 0.12, rotY: 0, rotZ: 0, transX: 0, transY: 0, transZ: 0 },
  PITCH: { rotX: 0, rotY: 0.1, rotZ: 0, transX: 0, transY: 0, transZ: 0 },
  YAW: { rotX: 0, rotY: 0, rotZ: 0.15, transX: 0, transY: 0, transZ: 0 },
  SURGE: { rotX: 0.02, rotY: 0, rotZ: 0, transX: 0, transY: 0, transZ: -0.08 },
  SWAY: { rotX: 0, rotY: 0.02, rotZ: 0, transX: 0, transY: 0.1, transZ: 0 },
  HEAVE: { rotX: 0, rotY: 0, rotZ: 0, transX: 0, transY: 0, transZ: 0.1 },
};

function clamp(v, min = 0, max = 1) {
  return Math.min(Math.max(v, min), max);
}

function smoothstep(t) {
  const c = clamp(t);
  return c * c * (3 - 2 * c);
}

/**
 * Returns active DOF index and blended motion state for the motion-demo scroll phase.
 */
export function getMotionDemoState(progress, motionPhaseStart = 0.72, motionPhaseEnd = 0.88) {
  const p = clamp(progress);
  if (p < motionPhaseStart) {
    return { activeDof: null, activeIndex: -1, motion: null, blend: 0 };
  }
  if (p >= motionPhaseEnd) {
    return { activeDof: 'HEAVE', activeIndex: 5, motion: DOF_MOTIONS.HEAVE, blend: 1 };
  }

  const local = (p - motionPhaseStart) / (motionPhaseEnd - motionPhaseStart);
  const segmentSize = 1 / DOF_SEQUENCE.length;
  const rawIndex = Math.min(Math.floor(local / segmentSize), DOF_SEQUENCE.length - 1);
  const segmentLocal = (local - rawIndex * segmentSize) / segmentSize;

  const activeDof = DOF_SEQUENCE[rawIndex];
  const blend = smoothstep(Math.sin(segmentLocal * Math.PI));

  return {
    activeDof,
    activeIndex: rawIndex,
    motion: DOF_MOTIONS[activeDof],
    blend,
  };
}

/** Apply motion offsets to a Three.js group ref. */
export function applyMotionToGroup(group, motion, blend, time = 0) {
  if (!group || !motion) return;

  const b = blend * 0.85;
  const idle = Math.sin(time * 1.4) * 0.015 * blend;

  group.rotation.x = motion.rotX * b;
  group.rotation.y = motion.rotY * b;
  group.rotation.z = motion.rotZ * b;
  group.position.x = motion.transX * b;
  group.position.y = motion.transY * b + idle;
  group.position.z = motion.transZ * b;
}
