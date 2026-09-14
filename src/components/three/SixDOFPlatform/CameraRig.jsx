import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { getScrollPhase } from './PlatformAnimation';

const CAMERA_PRESETS = {
  intro: { pos: [3.2, 2.0, 3.6], lookAt: [0, 0.3, 0] },
  disassembly: { pos: [3.6, 2.4, 3.2], lookAt: [0, 0.5, 0] },
  engineering: { pos: [2.8, 1.8, 4.0], lookAt: [0, 0.4, 0] },
  reassembly: { pos: [3.4, 2.2, 3.4], lookAt: [0, 0.35, 0] },
  motion: { pos: [3.0, 2.5, 3.8], lookAt: [0, 0.5, 0] },
  applications: { pos: [3.2, 2.0, 3.6], lookAt: [0, 0.3, 0] },
};

function lerp3(a, b, t) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

export default function CameraRig({ scrollProgress = 0 }) {
  const targetPos = useRef(CAMERA_PRESETS.intro.pos);
  const targetLook = useRef(CAMERA_PRESETS.intro.lookAt);
  const currentPos = useRef([...CAMERA_PRESETS.intro.pos]);
  const currentLook = useRef([...CAMERA_PRESETS.intro.lookAt]);

  useFrame(({ camera }, delta) => {
    const phase = getScrollPhase(scrollProgress);
    const preset = CAMERA_PRESETS[phase.id] || CAMERA_PRESETS.intro;
    targetPos.current = preset.pos;
    targetLook.current = preset.lookAt;

    const factor = Math.min(delta * 2.5, 1);
    currentPos.current = lerp3(currentPos.current, targetPos.current, factor);
    currentLook.current = lerp3(currentLook.current, targetLook.current, factor);

    camera.position.set(...currentPos.current);
    camera.lookAt(...currentLook.current);
  });

  return null;
}
