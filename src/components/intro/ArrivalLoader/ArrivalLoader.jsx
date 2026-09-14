import React, { useState, useEffect, useRef } from 'react';
import {
  ARRIVAL_STATES,
  createArrivalTimeline,
} from '../../../animations/arrivalAnimation';
import LogoBox from '../LogoBox/LogoBox';
import FormulaCar from '../FormulaCar/FormulaCar';
import ChainReveal from '../ChainReveal/ChainReveal';
import './ArrivalLoader.css';

export default function ArrivalLoader({ onComplete }) {
  const [currentState, setCurrentState] = useState(ARRIVAL_STATES.INTRO_START);
  const [isWiping, setIsWiping] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const canvasRef = useRef(null);
  const onCompleteRef = useRef(onComplete);

  // Keep ref updated
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Live Debug Timer (Counts 0.0s -> 7.8s every 100ms)
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      setElapsedTime(Math.min(7.8, elapsed));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Timeline Engine (Runs ONCE on mount)
  useEffect(() => {
    const timeline = createArrivalTimeline({
      onStateChange: (state) => {
        setCurrentState(state);
        if (state === ARRIVAL_STATES.TRANSITION) {
          setIsWiping(true);
        }
      },
      onComplete: () => {
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      },
    });

    const stopTimeline = timeline.start();
    return () => stopTimeline();
  }, []); // Empty dependency array ensures no premature cancellation

  const handleSkip = () => {
    setIsWiping(true);
    setTimeout(() => {
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
    }, 300);
  };

  // High-Density Particle & Smoke Canvas Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    const particleCount = 70;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height * 0.5 + (Math.random() - 0.5) * 220,
        radius: Math.random() * 4 + 1.5,
        speedX: (Math.random() - 0.75) * 4,
        speedY: (Math.random() - 0.5) * 1.5,
        opacity: Math.random() * 0.6 + 0.1,
        color: Math.random() > 0.35 ? '#ff1e27' : '#64748b',
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.y < 0 || p.y > canvas.height) p.y = canvas.height * 0.5;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.shadowBlur = p.radius * 4;
        ctx.shadowColor = p.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="arrival-container">
      {/* Live Debug Label */}
      <div className="arrival-debug-overlay">
        <div className="debug-timer">
          {currentState === ARRIVAL_STATES.INTRO_COMPLETE
            ? 'INTRO COMPLETE'
            : `INTRO ACTIVE — ${elapsedTime.toFixed(1)}s / 7.8s`}
        </div>
        <div className="debug-state">CURRENT STATE: {currentState}</div>
      </div>

      {/* Atmospheric Background */}
      <div className="arrival-atmosphere" />
      <div className="arrival-horizon-line" />

      {/* Canvas Layer */}
      <canvas ref={canvasRef} className="arrival-canvas" />

      {/* Skip Button */}
      <button className="arrival-skip-btn" onClick={handleSkip}>
        Skip Intro &rarr;
      </button>

      {/* 3D Metallic Logo Box */}
      <LogoBox state={currentState} />

      {/* Formula Car Entry & Movement */}
      <FormulaCar state={currentState} />

      {/* Segmented Metallic Chain & 3D Title */}
      <ChainReveal state={currentState} />

      {/* Transition Laser Wipe Overlay */}
      <div className={`arrival-transition-wipe ${isWiping ? 'active' : ''}`} />
    </div>
  );
}
