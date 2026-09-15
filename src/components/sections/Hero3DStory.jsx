import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronDown, Activity, Cpu, ShieldCheck, Gauge } from 'lucide-react';
import SimulatorStudioCanvas from '../three/SimulatorStudioCanvas';
import InteractiveDOFSection from './InteractiveDOFSection';
import InteractiveComponentExplorer from './InteractiveComponentExplorer';
import './Hero3DStory.css';

export default function Hero3DStory({ navigate }) {
  const [currentSection, setCurrentSection] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [hoveredHotspot, setHoveredHotspot] = useState(null);
  const [motionState, setMotionState] = useState({ roll: 0, pitch: 0, yaw: 0, surge: 0, sway: 0, heave: 0 });
  const containerRef = useRef(null);

  // Scroll storytelling section sync
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollProgress = -rect.top / (rect.height - window.innerHeight);
      const clamped = Math.max(0, Math.min(1, scrollProgress));

      // Calculate section (0 to 6)
      const section = Math.round(clamped * 6);
      setCurrentSection(section);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (path, e) => {
    if (e) e.preventDefault();
    if (navigate) navigate(path);
  };

  const scrollToSection = (secIndex) => {
    if (!containerRef.current) return;
    const targetY = containerRef.current.offsetTop + (secIndex / 6) * (containerRef.current.offsetHeight - window.innerHeight);
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  return (
    <div className="hero-3d-story-container" ref={containerRef}>

      {/* STICKY 3D CANVAS VIEWPORT */}
      <div className="sticky-3d-viewport">
        <SimulatorStudioCanvas
          storySection={currentSection}
          activeHotspot={activeHotspot}
          hoveredHotspot={hoveredHotspot}
          motion={motionState}
          onSelectHotspot={(id) => setActiveHotspot(id === activeHotspot ? null : id)}
          showHotspots={currentSection <= 3}
        />

        {/* TOP STATUS BAR OVERLAY */}
        <div className="story-hud-top font-mono">
          <div className="hud-pill">
            <span className="hud-dot-live" />
            <span>AE-SIMULATORS 3D PRODUCT VIEW</span>
          </div>
          <div className="hud-pill text-ae-red">
            <span>SECTION 0{currentSection + 1} / 07</span>
          </div>
        </div>
      </div>

      {/* SCROLLABLE STORY SECTIONS OVERLAY */}
      <div className="story-content-layer">

        {/* SECTION 00: MAIN HERO VIEW */}
        <section className="story-section hero-main-section">
          <div className="hero-content-box">
            <span className="hero-subheading font-mono text-ae-red">AUTOMOTIVE ENGINEERING SIMULATION</span>
            <h1 className="hero-title font-heading">
              AE-SIMULATORS
            </h1>
            <p className="hero-tagline font-heading text-ae-red">
              DRIVE REAL. TRAIN BETTER.
            </p>
            <p className="hero-description">
              Advanced driving simulator solutions combining realistic environments, precision motion platforms and intelligent driver evaluation.
            </p>
            <div className="hero-actions">
              <button
                type="button"
                className="btn-primary"
                onClick={() => scrollToSection(1)}
              >
                EXPLORE THE SIMULATOR <ArrowRight size={18} />
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={(e) => handleNavigate('/contact', e)}
              >
                CONTACT US
              </button>
            </div>
          </div>

          <div className="scroll-indicator font-mono" onClick={() => scrollToSection(1)}>
            <span>SCROLL TO EXPLORE</span>
            <ChevronDown size={18} className="bounce-arrow" />
          </div>
        </section>

        {/* SECTION 01: THE SIMULATOR */}
        <section className="story-section story-card-section left-align">
          <div className="story-card ae-card">
            <span className="section-tag font-mono text-ae-red">SECTION 01 — PRODUCT ARCHITECTURE</span>
            <h2 className="story-card-title">ENGINEERED FOR REALISM</h2>
            <p className="story-card-desc">
              Built with industrial rigidity, automotive ergonomics, and high-response motion control to deliver authentic dynamic vehicle feel.
            </p>
            <div className="story-card-specs font-mono">
              <div><span>STRUCTURE</span><strong>STEEL & ALUMINIUM CHASSIS</strong></div>
              <div><span>RIGIDITY</span><strong>INDUSTRIAL GRADE</strong></div>
              <div><span>FEEL</span><strong>REAL VEHICLE FEEDBACK</strong></div>
            </div>
          </div>
        </section>

        {/* SECTION 02: MOTION PLATFORM */}
        <section className="story-section story-card-section right-align">
          <div className="story-card ae-card">
            <span className="section-tag font-mono text-ae-red">SECTION 02 — HARDWARE KINEMATICS</span>
            <h2 className="story-card-title">6-DOF MOTION PLATFORM</h2>
            <p className="story-card-desc">
              Full 6 Degrees-of-Freedom hexapod platform featuring six precision electric actuators translating vehicle dynamics directly into chassis motion.
            </p>
            <button
              type="button"
              className="btn-text-link font-mono"
              onClick={(e) => handleNavigate('/motion-platform', e)}
            >
              EXPLORE KINEMATICS SPECIFICATIONS <ArrowRight size={16} />
            </button>
          </div>
        </section>

        {/* SECTION 03: COCKPIT & DRIVER INTERFACE */}
        <section className="story-section story-card-section left-align">
          <div className="story-card ae-card">
            <span className="section-tag font-mono text-ae-red">SECTION 03 — DRIVER INTERFACE</span>
            <h2 className="story-card-title">REALISTIC DRIVER INTERFACE</h2>
            <p className="story-card-desc">
              Precision steering wheel, load-cell pedal assembly, automotive seating, and triple display system designed for maximum immersion.
            </p>
            <div className="component-quick-pills font-mono">
              <span className="pill">COCKPIT</span>
              <span className="pill">STEERING</span>
              <span className="pill">PEDALS</span>
              <span className="pill">TRIPLE DISPLAY</span>
            </div>
          </div>
        </section>

        {/* SECTION 04: SIMULATION DISPLAY & SOFTWARE */}
        <section className="story-section story-card-section right-align">
          <div className="story-card ae-card">
            <span className="section-tag font-mono text-ae-red">SECTION 04 — SOFTWARE ENGINE</span>
            <h2 className="story-card-title">REAL-WORLD SIMULATION</h2>
            <p className="story-card-desc">
              Integrated simulation engine featuring real roads, multi-agent traffic, parking modules, turning scenarios, and dynamic day/night weather.
            </p>
            <button
              type="button"
              className="btn-text-link font-mono"
              onClick={(e) => handleNavigate('/software-platform', e)}
            >
              VIEW SOFTWARE MODULES <ArrowRight size={16} />
            </button>
          </div>
        </section>

        {/* SECTION 05: TELEMETRY STREAM */}
        <section className="story-section story-card-section left-align">
          <div className="story-card ae-card">
            <span className="section-tag font-mono text-ae-red">SECTION 05 — DATA ACQUISITION</span>
            <h2 className="story-card-title">REAL-TIME TELEMETRY</h2>
            <p className="story-card-desc">
              High-frequency sensor acquisition logging steering angle, pedal position, vehicle speed, slip angle, and 6-DOF acceleration vectors.
            </p>
            <div className="telemetry-stream-preview font-mono">
              <div className="telemetry-row"><span>STEER ANGLE</span><strong>12.4°</strong></div>
              <div className="telemetry-row"><span>BRAKE PRESSURE</span><strong>42 %</strong></div>
              <div className="telemetry-row"><span>LATERAL ACCEL</span><strong>0.84 G</strong></div>
            </div>
          </div>
        </section>

        {/* SECTION 06: DRIVER EVALUATION */}
        <section className="story-section story-card-section right-align">
          <div className="story-card ae-card">
            <span className="section-tag font-mono text-ae-red">SECTION 06 — ANALYTICS</span>
            <h2 className="story-card-title">MEASURE. EVALUATE. IMPROVE.</h2>
            <p className="story-card-desc">
              Structured evaluation framework scoring driver reaction time, lane discipline, signal compliance, and smooth control inputs.
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={(e) => handleNavigate('/technology', e)}
            >
              LEARN MORE ABOUT EVALUATION <ArrowRight size={16} />
            </button>
          </div>
        </section>
      </div>

      {/* INTERACTIVE 6-DOF PLATFORM CONTROLLER SECTION */}
      <InteractiveDOFSection
        motionState={motionState}
        setMotionState={setMotionState}
      />

      {/* INTERACTIVE COMPONENT EXPLORER SECTION */}
      <InteractiveComponentExplorer
        activeHotspot={activeHotspot}
        setActiveHotspot={setActiveHotspot}
        setHoveredHotspot={setHoveredHotspot}
      />
    </div>
  );
}
