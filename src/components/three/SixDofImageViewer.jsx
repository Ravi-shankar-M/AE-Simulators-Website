import React, { useState, useEffect, useRef, useCallback } from 'react';
import baseLayerImg from '../../pages/Simulators/Gaming/images/demo6dof-base-layer.png';
import platformLayerImg from '../../pages/Simulators/Gaming/images/demo6dof-platform-layer.png';
import { ArrowUpDown, RotateCw, MoveVertical, RefreshCw, MoveHorizontal, Compass, Move, Bug } from 'lucide-react';
import './SixDofImageViewer.css';

/* ── 6DOF PRESET MOTION STATES ── */
const PRESETS = {
  NEUTRAL: { heave: 0, surge: 0, sway: 0, roll: 0, pitch: 0, yaw: 0, label: 'NEUTRAL' },
  HEAVE_UP: { heave: -28, surge: 0, sway: 0, roll: 0, pitch: 0, yaw: 0, label: 'HEAVE UP' },
  HEAVE_DOWN: { heave: 28, surge: 0, sway: 0, roll: 0, pitch: 0, yaw: 0, label: 'HEAVE DOWN' },
  PITCH_UP: { heave: 0, surge: 0, sway: 0, roll: 0, pitch: -15, yaw: 0, label: 'PITCH UP' },
  PITCH_DOWN: { heave: 0, surge: 0, sway: 0, roll: 0, pitch: 15, yaw: 0, label: 'PITCH DOWN' },
  ROLL_LEFT: { heave: 0, surge: 0, sway: 0, roll: -12, pitch: 0, yaw: 0, label: 'ROLL LEFT' },
  ROLL_RIGHT: { heave: 0, surge: 0, sway: 0, roll: 12, pitch: 0, yaw: 0, label: 'ROLL RIGHT' },
  SURGE_FWD: { heave: 0, surge: 20, sway: 0, roll: 0, pitch: -6, yaw: 0, label: 'SURGE FWD' },
  SURGE_BWD: { heave: 0, surge: -20, sway: 0, roll: 0, pitch: 6, yaw: 0, label: 'SURGE BWD' },
  SWAY_LEFT: { heave: 0, surge: 0, sway: -25, roll: -6, pitch: 0, yaw: 0, label: 'SWAY LEFT' },
  SWAY_RIGHT: { heave: 0, surge: 0, sway: 25, roll: 6, pitch: 0, yaw: 0, label: 'SWAY RIGHT' },
  YAW_LEFT: { heave: 0, surge: 0, sway: 0, roll: 0, pitch: 0, yaw: -15, label: 'YAW LEFT' },
  YAW_RIGHT: { heave: 0, surge: 0, sway: 0, roll: 0, pitch: 0, yaw: 15, label: 'YAW RIGHT' },
};

/* ── ANCHOR CONSTANTS (300x300 canvas space from demo6dof.png) ── */
// Fixed lower cylinder top cap anchor positions B1...B6
const BASE_ANCHORS = {
  act1: { x: 68, y: 115 },
  act2: { x: 113, y: 115 },
  act3: { x: 135, y: 145 },
  act4: { x: 165, y: 145 },
  act5: { x: 187, y: 115 },
  act6: { x: 231, y: 115 },
};

// Platform center at neutral
const PLATFORM_CENTER_0 = { x: 150, y: 72 };

// Neutral top platform joint positions P1...P6 in canvas coordinates
const PLATFORM_JOINTS_0 = {
  act1: { x: 72, y: 84 },
  act2: { x: 89, y: 84 },
  act3: { x: 125, y: 84 },
  act4: { x: 175, y: 84 },
  act5: { x: 211, y: 84 },
  act6: { x: 228, y: 84 },
};

/**
 * Unified 6DOF Rigid-Body Platform Kinematics Transformation
 * Single Source of Truth for both Platform Image & Upper Joints P1...P6
 */
const computePlatformTransform = (curr) => {
  const Tx = curr.sway + curr.surge * 0.3 + curr.yaw * 0.5;
  const Ty = curr.heave + curr.surge * 0.8 + curr.pitch * 0.5;
  const rotDeg = curr.roll + curr.pitch * 0.8 + curr.yaw * 0.4;
  return { Tx, Ty, rotDeg };
};

const computeJointWorld = (key, curr) => {
  const { Tx, Ty, rotDeg } = computePlatformTransform(curr);
  const p0 = PLATFORM_JOINTS_0[key];
  const c0 = PLATFORM_CENTER_0;

  const dx = p0.x - c0.x;
  const dy = p0.y - c0.y;

  const rad = (rotDeg * Math.PI) / 180;
  const rx = dx * Math.cos(rad) - dy * Math.sin(rad);
  const ry = dx * Math.sin(rad) + dy * Math.cos(rad);

  return {
    x: c0.x + rx + Tx,
    y: c0.y + ry + Ty,
  };
};

export default function SixDofImageViewer({ height = '450px', demoMode = false }) {
  const [preset, setPreset] = useState('NEUTRAL');
  const [sliders, setSliders] = useState({
    heave: 0,
    surge: 0,
    sway: 0,
    roll: 0,
    pitch: 0,
    yaw: 0,
  });
  const [debugMode, setDebugMode] = useState(false);

  console.log('>>> [6DOF LIVE COMPONENT RENDERED] <<<', { preset, sliders });

  // Targets & Current state refs
  const targetRef = useRef({ heave: 0, surge: 0, sway: 0, roll: 0, pitch: 0, yaw: 0 });
  const currentRef = useRef({ heave: 0, surge: 0, sway: 0, roll: 0, pitch: 0, yaw: 0 });

  // DOM Refs (Static, persistent across re-renders)
  const platformGroupRef = useRef(null);
  const debugCenterRef = useRef(null);

  const rodKeys = ['act1', 'act2', 'act3', 'act4', 'act5', 'act6'];

  const rodGroupRefs = {
    act1: useRef(null),
    act2: useRef(null),
    act3: useRef(null),
    act4: useRef(null),
    act5: useRef(null),
    act6: useRef(null),
  };
  const rodRectRefs = {
    act1: useRef(null),
    act2: useRef(null),
    act3: useRef(null),
    act4: useRef(null),
    act5: useRef(null),
    act6: useRef(null),
  };
  const rodLineRefs = {
    act1: useRef(null),
    act2: useRef(null),
    act3: useRef(null),
    act4: useRef(null),
    act5: useRef(null),
    act6: useRef(null),
  };
  const rodCollarRefs = {
    act1: useRef(null),
    act2: useRef(null),
    act3: useRef(null),
    act4: useRef(null),
    act5: useRef(null),
    act6: useRef(null),
  };
  const rodBallRefs = {
    act1: useRef(null),
    act2: useRef(null),
    act3: useRef(null),
    act4: useRef(null),
    act5: useRef(null),
    act6: useRef(null),
  };

  const debugTopJointRefs = {
    act1: useRef(null),
    act2: useRef(null),
    act3: useRef(null),
    act4: useRef(null),
    act5: useRef(null),
    act6: useRef(null),
  };
  const debugLineRefs = {
    act1: useRef(null),
    act2: useRef(null),
    act3: useRef(null),
    act4: useRef(null),
    act5: useRef(null),
    act6: useRef(null),
  };

  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(null);
  const isAnimatingRef = useRef(false);

  // Direct DOM Render Update (Executes on every rAF & slider change without React overhead)
  const updateDOM = useCallback(() => {
    const curr = currentRef.current;
    const { Tx, Ty, rotDeg } = computePlatformTransform(curr);

    // 1. PRIMARY MOTION: Transform Upper Rigid Platform SVG Group directly
    if (platformGroupRef.current) {
      platformGroupRef.current.setAttribute(
        'transform',
        `translate(${Tx}, ${Ty}) rotate(${rotDeg}, 150, 72)`
      );
    }

    // 2. SECONDARY MOTION: Update 6 Chrome Actuator Rods to follow transformed platform joints P1...P6
    rodKeys.forEach((key) => {
      const base = BASE_ANCHORS[key];
      const top = computeJointWorld(key, curr);

      const dx = top.x - base.x;
      const dy = top.y - base.y;
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      const length = Math.hypot(dx, dy);

      if (rodGroupRefs[key].current) {
        rodGroupRefs[key].current.setAttribute(
          'transform',
          `translate(${base.x}, ${base.y}) rotate(${angle - 90})`
        );
      }
      if (rodRectRefs[key].current) {
        rodRectRefs[key].current.setAttribute('height', length);
      }
      if (rodLineRefs[key].current) {
        rodLineRefs[key].current.setAttribute('y2', length);
      }
      if (rodCollarRefs[key].current) {
        rodCollarRefs[key].current.setAttribute('y', length - 5);
      }
      if (rodBallRefs[key].current) {
        rodBallRefs[key].current.setAttribute('cy', length);
      }

      if (debugTopJointRefs[key].current) {
        debugTopJointRefs[key].current.setAttribute('cx', top.x);
        debugTopJointRefs[key].current.setAttribute('cy', top.y);
      }
      if (debugLineRefs[key].current) {
        debugLineRefs[key].current.setAttribute('x2', top.x);
        debugLineRefs[key].current.setAttribute('y2', top.y);
      }
    });

    if (debugCenterRef.current) {
      debugCenterRef.current.setAttribute('cx', 150 + Tx);
      debugCenterRef.current.setAttribute('cy', 72 + Ty);
    }
  }, [rodKeys]);

  // High-performance rAF loop for smooth preset transitions
  const animate = useCallback(
    (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = timestamp;

      const target = targetRef.current;
      const curr = currentRef.current;

      const alpha = 1 - Math.exp(-28 * dt);

      const diffHeave = target.heave - curr.heave;
      const diffSurge = target.surge - curr.surge;
      const diffSway = target.sway - curr.sway;
      const diffRoll = target.roll - curr.roll;
      const diffPitch = target.pitch - curr.pitch;
      const diffYaw = target.yaw - curr.yaw;

      const maxDiff = Math.hypot(diffHeave, diffSurge, diffSway, diffRoll, diffPitch, diffYaw);

      if (maxDiff < 0.005) {
        curr.heave = target.heave;
        curr.surge = target.surge;
        curr.sway = target.sway;
        curr.roll = target.roll;
        curr.pitch = target.pitch;
        curr.yaw = target.yaw;
        updateDOM();
        isAnimatingRef.current = false;
        animFrameRef.current = null;
        return;
      }

      curr.heave += diffHeave * alpha;
      curr.surge += diffSurge * alpha;
      curr.sway += diffSway * alpha;
      curr.roll += diffRoll * alpha;
      curr.pitch += diffPitch * alpha;
      curr.yaw += diffYaw * alpha;

      updateDOM();

      animFrameRef.current = requestAnimationFrame(animate);
    },
    [updateDOM]
  );

  const triggerAnimation = useCallback(() => {
    lastTimeRef.current = null;
    if (!isAnimatingRef.current) {
      isAnimatingRef.current = true;
      animFrameRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  const applyPreset = (key) => {
    setPreset(key);
    if (PRESETS[key]) {
      const p = PRESETS[key];
      setSliders({ ...p });
      targetRef.current = { heave: p.heave, surge: p.surge, sway: p.sway, roll: p.roll, pitch: p.pitch, yaw: p.yaw };
      currentRef.current = { heave: p.heave, surge: p.surge, sway: p.sway, roll: p.roll, pitch: p.pitch, yaw: p.yaw };
      updateDOM();
    }
  };

  // Immediate Slider Handler (Zero Latency - Instant Update on Drag)
  const handleSliderChange = (axis, value) => {
    const val = parseFloat(value);
    setPreset('CUSTOM');
    setSliders((prev) => ({ ...prev, [axis]: val }));
    targetRef.current[axis] = val;
    currentRef.current[axis] = val; // Direct current update for instant visual feedback
    updateDOM(); // Immediate synchronous render
  };

  useEffect(() => {
    updateDOM();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [updateDOM]);

  // Auto-play demo mode
  useEffect(() => {
    if (!demoMode) return;
    const presetKeys = Object.keys(PRESETS).filter(k => k !== 'NEUTRAL');
    let index = 0;
    
    // Start with a slight delay
    const initialTimer = setTimeout(() => {
      applyPreset(presetKeys[index]);
    }, 500);

    const intervalId = setInterval(() => {
      index = (index + 1) % presetKeys.length;
      applyPreset(presetKeys[index]);
    }, 2000); // cycle every 2 seconds

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalId);
    };
  }, [demoMode]);

  return (
    <div className="sixdof-container" style={{ height }}>
      <div className="sixdof-stage">
        <svg viewBox="0 0 300 300" className="sixdof-svg-canvas">
          <defs>
            <linearGradient id="demo6dofRodGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="25%" stopColor="#CBD5E1" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="75%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>

            <linearGradient id="demo6dofOrangeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#880005" />
              <stop offset="50%" stopColor="#E31B23" />
              <stop offset="100%" stopColor="#880005" />
            </linearGradient>

            <filter id="demo6dofShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="1.5" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* LAYER 1: FIXED BASE & LOWER ACTUATOR BODIES (NATIVE SVG IMAGE) */}
          <image
            href={baseLayerImg}
            x="0"
            y="0"
            width="300"
            height="300"
            preserveAspectRatio="xMidYMid meet"
          />

          {/* LAYER 2: 6 DYNAMIC CHROME ACTUATOR RODS */}
          <g className="sixdof-rods-group" filter="url(#demo6dofShadow)">
            {rodKeys.map((key) => {
              const base = BASE_ANCHORS[key];
              const top = computeJointWorld(key, currentRef.current);
              const dx = top.x - base.x;
              const dy = top.y - base.y;
              const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
              const length = Math.hypot(dx, dy);

              return (
                <g
                  key={key}
                  ref={rodGroupRefs[key]}
                  transform={`translate(${base.x}, ${base.y}) rotate(${angle - 90})`}
                >
                  <rect
                    ref={rodRectRefs[key]}
                    x="-4"
                    y="0"
                    width="8"
                    height={length}
                    fill="url(#demo6dofRodGrad)"
                    rx="2"
                  />
                  <line
                    ref={rodLineRefs[key]}
                    x1="-1"
                    y1="0"
                    x2="-1"
                    y2={length}
                    stroke="#FFFFFF"
                    strokeWidth="1"
                    strokeOpacity="0.9"
                  />
                  <rect
                    ref={rodCollarRefs[key]}
                    x="-6"
                    y={length - 5}
                    width="12"
                    height="5"
                    fill="url(#demo6dofOrangeGrad)"
                    rx="1"
                  />
                  <circle
                    ref={rodBallRefs[key]}
                    cx="0"
                    cy={length}
                    r="4.5"
                    fill="url(#demo6dofRodGrad)"
                    stroke="#0F172A"
                    strokeWidth="1"
                  />
                </g>
              );
            })}
          </g>

          {/* LAYER 3: MOVING UPPER PLATFORM (NATIVE SVG GROUP WITH TRANSFORM) */}
          <g ref={platformGroupRef} transform="translate(0, 0)">
            <image
              href={platformLayerImg}
              x="0"
              y="0"
              width="300"
              height="300"
              preserveAspectRatio="xMidYMid meet"
            />
          </g>

          {/* DEBUG OVERLAY */}
          {debugMode && (
            <g className="sixdof-debug-overlay">
              <circle ref={debugCenterRef} cx="150" cy="72" r="4" fill="#FFD700" stroke="#000" strokeWidth="1" />
              {rodKeys.map((key) => {
                const base = BASE_ANCHORS[key];
                const top = computeJointWorld(key, currentRef.current);
                return (
                  <g key={`debug-${key}`}>
                    <line
                      ref={debugLineRefs[key]}
                      x1={base.x}
                      y1={base.y}
                      x2={top.x}
                      y2={top.y}
                      stroke="#00D2FF"
                      strokeWidth="1.5"
                      strokeDasharray="3,2"
                    />
                    <circle cx={base.x} cy={base.y} r="3" fill="#00FF66" />
                    <circle
                      ref={debugTopJointRefs[key]}
                      cx={top.x}
                      cy={top.y}
                      r="3"
                      fill="#FF2A33"
                    />
                  </g>
                );
              })}
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}


