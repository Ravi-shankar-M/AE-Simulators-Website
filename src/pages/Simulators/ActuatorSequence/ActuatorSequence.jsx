import React, { useState, useEffect, useRef, useCallback } from 'react';
import './ActuatorSequence.css';

const TOTAL_FRAMES = 110;
const START_FRAME = 120;
const END_FRAME = 11;

const frameModules = import.meta.glob('./images/actuator-sequence/*.png', { eager: true });

const getFramePath = (index) => {
  const actualFrame = START_FRAME - index;
  const frameStr = String(actualFrame).padStart(3, '0');
  const pathKey = `./images/actuator-sequence/ezgif-frame-${frameStr}-clean.png`;
  return frameModules[pathKey] ? frameModules[pathKey].default : '';
};

// 6 Stages Data strictly following specified frame ranges (120-101, 100-81, 80-61, 60-41, 40-21, 20-11)
const STAGES = [
  {
    stageNum: '01',
    title: 'BASE STRUCTURE & POWER ASSEMBLY',
    desc: 'Heavy-duty CNC machined base, motor mounting block, and power distribution interface.',
    range: '120 — 101',
  },
  {
    stageNum: '02',
    title: 'BRUSHLESS SERVO DRIVE UNIT',
    desc: 'High-torque AC brushless servo drive motor engaging with precision feedback encoder.',
    range: '100 — 81',
  },
  {
    stageNum: '03',
    title: 'BALL SCREW TRANSMISSION',
    desc: 'Precision low-backlash ball screw mechanism and dual thrust bearing system alignment.',
    range: '80 — 61',
  },
  {
    stageNum: '04',
    title: 'INNER LINEAR GUIDANCE',
    desc: 'Telescopic linear drive shaft and dynamic load-sensing guidance mechanism.',
    range: '60 — 41',
  },
  {
    stageNum: '05',
    title: 'TELESCOPIC CYLINDER HOUSING',
    desc: 'Protective aluminum outer enclosure sealing internal mechanical drive components.',
    range: '40 — 21',
  },
  {
    stageNum: '06',
    title: 'UNIVERSAL MOUNTING FLANGE',
    desc: 'Upper payload connection joint and universal swivel flange for 6-DOF Stewart platform integration.',
    range: '20 — 11',
  },
];

export default function ActuatorScrollExperience({ navigate }) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const currentFrameRef = useRef(0);
  const activeStageRef = useRef(0);
  const requestRef = useRef(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [activeStage, setActiveStage] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Preload exact 110 frames (120 -> 011) before animation begins
  useEffect(() => {
    let isMounted = true;
    let loadedCount = 0;
    const loadedImages = new Array(TOTAL_FRAMES);

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);

      const handleImageLoad = () => {
        if (!isMounted) return;
        loadedCount++;
        setLoadProgress(Math.floor((loadedCount / TOTAL_FRAMES) * 100));
        if (loadedCount === TOTAL_FRAMES) {
          imagesRef.current = loadedImages;
          setIsLoaded(true);
        }
      };

      img.onload = handleImageLoad;
      img.onerror = handleImageLoad; // Fallback to prevent stall
      loadedImages[i] = img;
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Render a specific frame index to Canvas — centered, landscape composition, seamless background
  const drawFrame = useCallback((frameIndex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: false });
    const img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // Clean white background matching AE website theme
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Use imageSmoothingQuality for crisp rendering on retina
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;
    const imgAspect = imgW / imgH;
    const containerAspect = width / height;

    // Full screen canvas rendering — zoomed out for comfortable margins and framing
    const isMobile = width < 768;
    const fillFactorH = isMobile ? 0.78 : 0.72;
    const fillFactorW = isMobile ? 0.82 : 0.76;

    let drawW, drawH;
    if (containerAspect > imgAspect) {
      drawH = height * fillFactorH;
      drawW = drawH * imgAspect;
    } else {
      drawW = width * fillFactorW;
      drawH = drawW / imgAspect;
    }

    const offsetX = (width - drawW) / 2;
    const offsetY = (height - drawH) / 2;

    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    ctx.restore();
  }, []);

  // Request Animation Frame rendering loop
  const requestRender = useCallback(() => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    requestRef.current = requestAnimationFrame(() => {
      drawFrame(currentFrameRef.current);
    });
  }, [drawFrame]);

  // Initial draw of frame 120 once loaded
  useEffect(() => {
    if (isLoaded) {
      requestRender();
    }
  }, [isLoaded, requestRender]);

  // Scroll listener tracking sticky scroll progress (scroll down = 120->11, scroll up = 11->120)
  useEffect(() => {
    if (!isLoaded || isReducedMotion) return;

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollableDistance = rect.height - windowHeight;

      if (totalScrollableDistance <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.min(Math.max(currentScroll / totalScrollableDistance, 0), 1);

      // Reversible Frame Index (0 maps to 120, 109 maps to 011)
      const currentFrameIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(progress * (TOTAL_FRAMES - 1))));
      const actualFrame = START_FRAME - currentFrameIndex;

      if (currentFrameIndex !== currentFrameRef.current) {
        currentFrameRef.current = currentFrameIndex;
        requestRender();
      }

      // Exact 6-Stage detection based on actual frame number:
      // Stage 01: 120-101
      // Stage 02: 100-81
      // Stage 03: 80-61
      // Stage 04: 60-41
      // Stage 05: 40-21
      // Stage 06: 20-11
      let newStage = 0;
      if (actualFrame >= 101 && actualFrame <= 120) newStage = 0;
      else if (actualFrame >= 81 && actualFrame <= 100) newStage = 1;
      else if (actualFrame >= 61 && actualFrame <= 80) newStage = 2;
      else if (actualFrame >= 41 && actualFrame <= 60) newStage = 3;
      else if (actualFrame >= 21 && actualFrame <= 40) newStage = 4;
      else if (actualFrame >= 11 && actualFrame <= 20) newStage = 5;

      if (newStage !== activeStageRef.current) {
        activeStageRef.current = newStage;
        setActiveStage(newStage);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', requestRender);

    // Initial render call
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', requestRender);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isLoaded, isReducedMotion, requestRender]);

  const currentStageInfo = STAGES[activeStage] || STAGES[0];

  // Static Fallback for prefers-reduced-motion
  if (isReducedMotion) {
    return (
      <section className="ae-actuator-reduced-motion-fallback" aria-label="Actuator Hardware Disassembly">
        <h2 className="ae-actuator-stage-title">6-DOF STEWART MOTION ACTUATOR</h2>
        <p className="ae-actuator-stage-desc" style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
          Fully assembled high-dynamic electromechanical linear actuator for 6-DOF Stewart Hexapod motion platforms.
        </p>
        <img
          src={getFramePath(0)}
          alt="Fully assembled 6-DOF Stewart Platform Linear Actuator"
          className="ae-actuator-fallback-img"
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
        />
      </section>
    );
  }

  return (
    <div className="ae-actuator-experience-wrapper">
      {!isLoaded ? (
        /* Minimal Preloading Interface */
        <div className="ae-actuator-loader-overlay">
          <div className="ae-actuator-loader-card">
            <div className="ae-actuator-loader-badge font-mono">
              <span className="ae-actuator-loader-dot" />
              6-DOF KINEMATICS
            </div>
            <h3 className="ae-actuator-loader-title">LOADING ACTUATOR EXPERIENCE</h3>
            <div className="ae-actuator-loader-track">
              <div
                className="ae-actuator-loader-bar"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
            <span className="ae-actuator-loader-percentage font-mono">{loadProgress}%</span>
          </div>
        </div>
      ) : (
        /* Sticky Scroll Experience Section */
        <section
          ref={sectionRef}
          className="ae-actuator-scroll-section"
          aria-label="Interactive 6-Stage Actuator Assembly Experience"
        >
          <div className="ae-actuator-sticky-viewport">
            
            {/* Canvas Display with Integrated Technical Environment Overlays */}
            <div
              className="ae-actuator-canvas-container"
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            >
              <canvas ref={canvasRef} className="ae-actuator-canvas" />
            </div>

            {/* Desktop Left Info Box */}
            <div className="ae-actuator-info-panel">
              <div className="ae-actuator-info-card">
                <span className="ae-actuator-stage-number font-mono">STAGE {currentStageInfo.stageNum} / 06</span>
                <h3 className="ae-actuator-stage-title font-heading">{currentStageInfo.title}</h3>
                <p className="ae-actuator-stage-desc font-body">{currentStageInfo.desc}</p>
              </div>
            </div>

            {/* Bottom Bar: 6-Stage Indicator */}
            <div className="ae-actuator-bottom-bar" style={{ justifyContent: 'center' }}>
              <div className="ae-actuator-stage-indicator">
                {STAGES.map((stg, idx) => (
                  <React.Fragment key={stg.title}>
                    <div className="ae-actuator-indicator-item">
                      <span
                        className={`ae-actuator-indicator-chip font-mono ${
                          activeStage === idx ? 'active' : ''
                        }`}
                      >
                        {stg.stageNum}
                      </span>
                    </div>
                    {idx < STAGES.length - 1 && (
                      <div
                        className={`ae-actuator-indicator-line ${
                          activeStage > idx ? 'active' : ''
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

          </div>
        </section>
      )}
    </div>
  );
}
