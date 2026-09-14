import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollReveal from '../../../components/common/ScrollReveal';
import ProtectedImage from '../../../components/common/ProtectedImage';
import DriverEvaluationWorkflow from './DriverEvaluationWorkflow';
import { ShieldCheck, ArrowRight, Cpu, Gauge, Layers } from 'lucide-react';
import aeSimHeroImage from '../../Dashboard/Hero/images/ae-sim-hero-image.webp';
import '../../Dashboard/Hero/Hero.css';
import './TrainingSimulators.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function TrainingSimulators({ navigate }) {
  const heroRef = useRef(null);
  const bgLayerRef = useRef(null);
  const midLayerRef = useRef(null);
  const fgLayerRef = useRef(null);
  const textLayerRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !heroRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      if (bgLayerRef.current) {
        tl.to(bgLayerRef.current, {
          y: 80,
          scale: 1.05,
          ease: 'none',
        }, 0);
      }

      if (midLayerRef.current) {
        tl.to(midLayerRef.current, {
          y: 140,
          scale: 1.08,
          ease: 'none',
        }, 0);
      }

      if (fgLayerRef.current) {
        tl.to(fgLayerRef.current, {
          y: 220,
          opacity: 0.7,
          ease: 'none',
        }, 0);
      }

      if (textLayerRef.current) {
        tl.to(textLayerRef.current, {
          y: 60,
          opacity: 0.85,
          ease: 'none',
        }, 0);
      }
    }, heroRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const handleNavigate = (path, e) => {
    if (e) e.preventDefault();
    if (navigate) navigate(path);
  };

  const trainingProducts = [
    {
      id: '3dof',
      type: '3-DOF MOTION PLATFORM',
      title: '3-DOF SIMULATORS',
      subtitle: 'Dynamic Pitch, Roll & Heave Motion Feedback',
      desc: 'Compact 3-DOF motion platform providing precise pitch, roll, and heave forces ideal for driver training and qualification.',
      features: [
        '3 High-precision industrial linear actuators',
        'Sub-millisecond motion control loop',
        'Pitch (+/- 15 deg), Roll (+/- 15 deg), Heave motion cues',
        'Integrated telemetry scoring & feedback'
      ],
      spec: '3-DOF PLATFORM'
    },
    {
      id: '6dof',
      type: '6-DOF HEXAPOD PLATFORM',
      title: '6-DOF SIMULATORS',
      subtitle: 'Complete 6 Degrees of Freedom Vehicle Dynamics',
      desc: 'Full 6-DOF Hexapod motion platform providing Roll, Pitch, Yaw, Surge, Sway, and Heave for extreme realism.',
      features: [
        'Full 6-DOF inverse kinematics solver',
        'Grounded bottom frame with synchronized actuator leg motion',
        'Driver-in-the-Loop (DIL) research and ADAS tuning',
        'Multi-axis vibration and bump feedback system'
      ],
      spec: '6-DOF HEXAPOD'
    }
  ];

  return (
    <div className="training-page-wrapper">
      {/* AUTOMOTIVE HERO SHOWCASE SECTION WITH CONTENT & IMAGE VISUAL */}
      <div id="training-hero-section">
        <section className="hero-parallax-section" ref={heroRef} style={{ marginTop: 0 }}>
          {/* LAYER 0: BACKGROUND TECHNICAL GRID & ROAD ATMOSPHERE */}
          <div className="hero-layer hero-bg-layer" ref={bgLayerRef}>
            <div className="hero-tech-grid-pattern" />
            <div className="hero-gradient-overlay" />
            <div className="hero-road-perspective-lines" />
          </div>

          {/* LAYER 1: MIDGROUND SIMULATOR VISUAL */}
          <div className="hero-layer hero-mid-layer" ref={midLayerRef}>
            <div className="simulator-image-container">
              <ProtectedImage
                src={aeSimHeroImage}
                alt="AE-Simulators Driving Simulator Platform"
                className="hero-simulator-visual"
              />
              <div className="simulator-ambient-glow" />
            </div>
          </div>

          {/* LAYER 2: FOREGROUND TECHNICAL ACCENTS */}
          <div className="hero-layer hero-fg-layer" ref={fgLayerRef} />

          {/* LAYER 3: MAIN MESSAGING & ACTION BUTTONS */}
          <div className="hero-layer hero-text-layer" ref={textLayerRef}>
            <div className="hero-content-wrapper">
              <h1 className="hero-main-heading">
                <span className="heading-line heading-dark" style={{ display: 'block' }}>DRIVE REAL.</span>
                <span className="heading-line heading-red" style={{ display: 'block', marginTop: '0.15em' }}>TRAIN BETTER.</span>
              </h1>

              <p className="hero-supporting-text">
                Advanced driving simulator solutions combining <strong>industrial motion platforms</strong>, <strong>real-road physics engines</strong>, and <strong>intelligent driver evaluation</strong> for automotive R&amp;D, professional training, and vehicle testing.
              </p>

              <div className="training-hero-cards-grid-clean">
                <div className="training-hero-card-clean">
                  <div className="card-clean-icon">
                    <Cpu size={18} color="#E31B23" />
                  </div>
                  <span className="card-clean-title">Motion Platform Systems</span>
                </div>

                <div className="training-hero-card-clean">
                  <div className="card-clean-icon">
                    <Gauge size={18} color="#E31B23" />
                  </div>
                  <span className="card-clean-title">Real-Road Dynamics</span>
                </div>

                <div className="training-hero-card-clean">
                  <div className="card-clean-icon">
                    <ShieldCheck size={18} color="#E31B23" />
                  </div>
                  <span className="card-clean-title">Driver Evaluation</span>
                </div>

                <div className="training-hero-card-clean">
                  <div className="card-clean-icon">
                    <Layers size={18} color="#E31B23" />
                  </div>
                  <span className="card-clean-title">Professional Training</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="training-container" style={{ paddingTop: '60px' }}>
        {/* HERO HEADER */}
        <ScrollReveal variant="fade-up">
          <div className="training-hero-header">
            <h1 className="training-hero-title">
              TRAINING <span className="text-ae-red">SIMULATORS</span>
            </h1>
            <p className="training-hero-desc">
              Institutional-grade driving simulators designed for research institutions, defense training centers, automotive OEMs, and professional driving academies.
            </p>
          </div>
        </ScrollReveal>

        {/* DRIVER EVALUATION WORKFLOW SECTION */}
        <DriverEvaluationWorkflow navigate={navigate} />

        {/* TRAINING CARDS GRID */}
        <div className="training-cards-grid">
          {trainingProducts.map((prod) => (
            <ScrollReveal key={prod.id} variant="scale-up">
              <div className="training-card ae-card">
                {prod.badge && <span className="training-viewer-badge font-mono">{prod.badge}</span>}
                <h3 className="training-viewer-title" style={{ marginTop: '12px' }}>{prod.title}</h3>
                <p className="training-hero-desc" style={{ fontSize: '0.95rem', margin: '12px 0 20px' }}>{prod.desc}</p>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0' }}>
                  {prod.features.map((feat, fIdx) => (
                    <li key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '0.9rem', color: '#4A515A' }}>
                      <ShieldCheck size={16} color="#E31B23" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className="contact-us-red-btn full-width"
                  style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}
                  onClick={(e) => handleNavigate('/contact', e)}
                >
                  INQUIRE FOR TRAINING PLATFORM <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                </button>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
