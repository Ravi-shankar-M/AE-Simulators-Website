import React, { useState, useEffect, useRef, useCallback } from 'react';
import ProtectedImage from '../common/ProtectedImage';
import baseLayerImg from '../../pages/Simulators/Gaming/images/3dof-base-layer.png';
import platformLayerImg from '../../pages/Simulators/Gaming/images/3dof-platform-layer.png';
import { ArrowUpDown, RotateCw, MoveVertical, RefreshCw } from 'lucide-react';
import './ThreeDofImageViewer.css';

/* ── PRESET MOTION STATES ── */
const PRESETS = {
  NEUTRAL: { heave: 0, roll: 0, pitch: 0, label: 'NEUTRAL' },
  HEAVE_UP: { heave: -28, roll: 0, pitch: 0, label: 'HEAVE UP' },
  HEAVE_DOWN: { heave: 28, roll: 0, pitch: 0, label: 'HEAVE DOWN' },
  ROLL_LEFT: { heave: 0, roll: -10, pitch: 0, label: 'ROLL LEFT' },
  ROLL_RIGHT: { heave: 0, roll: 10, pitch: 0, label: 'ROLL RIGHT' },
  PITCH_UP: { heave: 0, roll: 0, pitch: -10, label: 'PITCH UP' },
  PITCH_DOWN: { heave: 0, roll: 0, pitch: 10, label: 'PITCH DOWN' },
};

/* ── ANCHOR CONSTANTS (860x860 canvas space) ── */
const BASE_ANCHORS = {
  left: { x: 208, y: 360 },
  center: { x: 440, y: 230 },
  right: { x: 675, y: 360 },
};

const PLATFORM_JOINTS_0 = {
  left: { dx: -224, dy: 78 },
  center: { dx: 0, dy: 78 },
  right: { dx: 224, dy: 78 },
};

const PLATFORM_CENTER_0 = { x: 440, y: 100 };

export default function ThreeDofImageViewer({ height = '450px' }) {
  const [preset, setPreset] = useState('NEUTRAL');
  const [sliders, setSliders] = useState({ heave: 0, roll: 0, pitch: 0 });

  // Kinematic Targets and Interpolated State kept in Refs for ZERO React re-renders during motion
  const targetRef = useRef({ heave: 0, roll: 0, pitch: 0 });
  const currentRef = useRef({ heave: 0, roll: 0, pitch: 0 });

  // DOM Refs for direct SVG/CSS manipulation
  const platformRef = useRef(null);

  const rodGroupRefs = {
    left: useRef(null),
    center: useRef(null),
    right: useRef(null),
  };
  const rodRectRefs = {
    left: useRef(null),
    center: useRef(null),
    right: useRef(null),
  };
  const rodLineRefs = {
    left: useRef(null),
    center: useRef(null),
    right: useRef(null),
  };
  const rodCollarRefs = {
    left: useRef(null),
    center: useRef(null),
    right: useRef(null),
  };
  const rodBallRefs = {
    left: useRef(null),
    center: useRef(null),
    right: useRef(null),
  };

  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(null);
  const isAnimatingRef = useRef(false);

  // Compute Joint Position
  const computeJoint = useCallback((key, state) => {
    const j0 = PLATFORM_JOINTS_0[key];
    let dy = j0.dy;

    if (key === 'left' || key === 'right') {
      dy -= state.pitch * 1.4;
    } else if (key === 'center') {
      dy += state.pitch * 2.2;
    }

    const dx = j0.dx;
    const rollRad = (state.roll * Math.PI) / 180;
    const platformCenterY = PLATFORM_CENTER_0.y + state.heave + state.pitch * 1.5;

    const rotX = dx * Math.cos(rollRad) - dy * Math.sin(rollRad);
    const rotY = dx * Math.sin(rollRad) + dy * Math.cos(rollRad);

    return {
      x: PLATFORM_CENTER_0.x + rotX,
      y: platformCenterY + rotY,
    };
  }, []);

  // Direct DOM Render Update (Executes on every rAF without React overhead)
  const updateDOM = useCallback(() => {
    const curr = currentRef.current;

    // 1. Update Upper Platform CSS Transform
    if (platformRef.current) {
      platformRef.current.style.transform = `translate3d(0px, ${curr.heave + curr.pitch * 1.5}px, 0px) rotate(${curr.roll}deg)`;
    }

    // 2. Update 3 Actuator Rods
    ['center', 'left', 'right'].forEach((key) => {
      const base = BASE_ANCHORS[key];
      const top = computeJoint(key, curr);

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
        rodCollarRefs[key].current.setAttribute('y', length - 12);
      }
      if (rodBallRefs[key].current) {
        rodBallRefs[key].current.setAttribute('cy', length);
      }
    });
  }, [computeJoint]);

  // High-Performance Frame-Rate Independent Delta-Time Loop
  const animate = useCallback(
    (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05); // cap at 50ms
      lastTimeRef.current = timestamp;

      const target = targetRef.current;
      const curr = currentRef.current;

      // Exponential smoothing factor (24 rad/s speed = rapid response, zero lag, smooth convergence)
      const alpha = 1 - Math.exp(-24 * dt);

      const diffHeave = target.heave - curr.heave;
      const diffRoll = target.roll - curr.roll;
      const diffPitch = target.pitch - curr.pitch;

      const maxDiff = Math.hypot(diffHeave, diffRoll, diffPitch);

      if (maxDiff < 0.005) {
        // Clamped exact arrival
        curr.heave = target.heave;
        curr.roll = target.roll;
        curr.pitch = target.pitch;
        updateDOM();
        isAnimatingRef.current = false;
        animFrameRef.current = null;
        return;
      }

      curr.heave += diffHeave * alpha;
      curr.roll += diffRoll * alpha;
      curr.pitch += diffPitch * alpha;

      updateDOM();

      animFrameRef.current = requestAnimationFrame(animate);
    },
    [updateDOM]
  );

  // Trigger animation loop
  const triggerAnimation = useCallback(() => {
    lastTimeRef.current = performance.now();
    if (!isAnimatingRef.current) {
      isAnimatingRef.current = true;
      animFrameRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  // Handle Preset Change
  const applyPreset = (key) => {
    setPreset(key);
    if (PRESETS[key]) {
      const p = PRESETS[key];
      setSliders({ heave: p.heave, roll: p.roll, pitch: p.pitch });
      targetRef.current = { ...p };
      triggerAnimation();
    }
  };

  // Handle Slider Input (Immediate Target Update with ZERO debounce)
  const handleSliderChange = (axis, value) => {
    const val = parseFloat(value);
    setPreset('CUSTOM');
    setSliders((prev) => ({ ...prev, [axis]: val }));
    targetRef.current[axis] = val;
    triggerAnimation();
  };

  // Cleanup on unmount
  useEffect(() => {
    updateDOM(); // Initial render
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [updateDOM]);

  return (
    <div className="threedof-container" style={{ height }}>
      {/* ── STAGE VIEWPORT ── */}
      <div className="threedof-stage">
        <svg viewBox="0 0 860 860" className="threedof-svg-canvas">
          <defs>
            {/* Metallic Silver Rod Gradient */}
            <linearGradient id="rodGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="25%" stopColor="#CBD5E1" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="75%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>

            {/* Dark Steel Collar Gradient */}
            <linearGradient id="collarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="50%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>

            {/* Drop Shadow for Rods */}
            <filter id="rodShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="3" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* LAYER 1: FIXED BASE & LOWER ACTUATOR CYLINDERS */}
          <foreignObject x="0" y="0" width="860" height="860">
            <ProtectedImage
              src={baseLayerImg}
              alt="3DOF Base & Actuators"
              className="threedof-base-img"
            />
          </foreignObject>

          {/* LAYER 2: EXTENDING/RETRACTING CHROME ACTUATOR RODS */}
          <g className="threedof-rods-group" filter="url(#rodShadow)">
            {['center', 'left', 'right'].map((key) => {
              const base = BASE_ANCHORS[key];
              const top = computeJoint(key, currentRef.current);
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
                  {/* Outer Chrome Shaft Cylinder */}
                  <rect
                    ref={rodRectRefs[key]}
                    x="-10"
                    y="0"
                    width="20"
                    height={length}
                    fill="url(#rodGrad)"
                    rx="4"
                  />

                  {/* Highlight Bevel line */}
                  <line
                    ref={rodLineRefs[key]}
                    x1="-3"
                    y1="0"
                    x2="-3"
                    y2={length}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    strokeOpacity="0.8"
                  />

                  {/* Top Joint Collar Socket */}
                  <rect
                    ref={rodCollarRefs[key]}
                    x="-14"
                    y={length - 12}
                    width="28"
                    height="14"
                    fill="url(#collarGrad)"
                    rx="3"
                  />
                  {/* Ball Joint Head */}
                  <circle
                    ref={rodBallRefs[key]}
                    cx="0"
                    cy={length}
                    r="9"
                    fill="url(#rodGrad)"
                    stroke="#1E293B"
                    strokeWidth="2"
                  />
                </g>
              );
            })}
          </g>

          {/* LAYER 3: RIGID MOVING UPPER PLATFORM */}
          <foreignObject
            ref={platformRef}
            x="0"
            y="0"
            width="860"
            height="860"
            style={{
              transform: `translate3d(0px, 0px, 0px) rotate(0deg)`,
              transformOrigin: '440px 100px',
              willChange: 'transform',
            }}
          >
            <ProtectedImage
              src={platformLayerImg}
              alt="3DOF Upper Rigid Platform"
              className="threedof-platform-img"
            />
          </foreignObject>
        </svg>

        {/* STATUS OVERLAY */}
        <div className="threedof-status-overlay font-mono">
          <span className={`threedof-dot ${preset === 'NEUTRAL' ? '' : 'active'}`} />
          <span className="threedof-preset-name">{preset}</span>
        </div>
      </div>

      {/* ── MOTION CONTROLS STRIP & SLIDERS ── */}
      <div className="threedof-controls-panel font-mono">
        {/* PRESET BUTTONS */}
        <div className="threedof-preset-buttons">
          <button
            type="button"
            className={`threedof-btn ${preset === 'NEUTRAL' ? 'active' : ''}`}
            onClick={() => applyPreset('NEUTRAL')}
          >
            <RefreshCw size={13} /> NEUTRAL
          </button>
          <button
            type="button"
            className={`threedof-btn ${preset.startsWith('HEAVE') ? 'active' : ''}`}
            onClick={() => applyPreset(sliders.heave < 0 ? 'HEAVE_DOWN' : 'HEAVE_UP')}
          >
            <ArrowUpDown size={13} /> HEAVE
          </button>
          <button
            type="button"
            className={`threedof-btn ${preset.startsWith('ROLL') ? 'active' : ''}`}
            onClick={() => applyPreset(sliders.roll > 0 ? 'ROLL_LEFT' : 'ROLL_RIGHT')}
          >
            <RotateCw size={13} /> ROLL
          </button>
          <button
            type="button"
            className={`threedof-btn ${preset.startsWith('PITCH') ? 'active' : ''}`}
            onClick={() => applyPreset(sliders.pitch > 0 ? 'PITCH_UP' : 'PITCH_DOWN')}
          >
            <MoveVertical size={13} /> PITCH
          </button>
        </div>

        {/* INTERACTIVE SLIDERS FOR FINE KINEMATICS CONTROL */}
        <div className="threedof-sliders-grid">
          <div className="threedof-slider-group">
            <div className="slider-label-row">
              <span>HEAVE</span>
              <span className="slider-val">{sliders.heave.toFixed(0)} px</span>
            </div>
            <input
              type="range"
              min="-30"
              max="30"
              step="1"
              value={sliders.heave}
              onChange={(e) => handleSliderChange('heave', e.target.value)}
              className="threedof-slider"
            />
          </div>

          <div className="threedof-slider-group">
            <div className="slider-label-row">
              <span>ROLL</span>
              <span className="slider-val">{sliders.roll.toFixed(0)}°</span>
            </div>
            <input
              type="range"
              min="-12"
              max="12"
              step="1"
              value={sliders.roll}
              onChange={(e) => handleSliderChange('roll', e.target.value)}
              className="threedof-slider"
            />
          </div>

          <div className="threedof-slider-group">
            <div className="slider-label-row">
              <span>PITCH</span>
              <span className="slider-val">{sliders.pitch.toFixed(0)}°</span>
            </div>
            <input
              type="range"
              min="-12"
              max="12"
              step="1"
              value={sliders.pitch}
              onChange={(e) => handleSliderChange('pitch', e.target.value)}
              className="threedof-slider"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
