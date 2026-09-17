import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollReveal from '../../../components/common/ScrollReveal';
import ProtectedImage from '../../../components/common/ProtectedImage';
import DriverEvaluationWorkflow from './DriverEvaluationWorkflow';
import ThreeDofImageViewer from '../../../components/three/ThreeDofImageViewer';
import SixDofImageViewer from '../../../components/three/SixDofImageViewer';
import { ShieldCheck, ArrowRight, Cpu, Gauge, Layers, Activity } from 'lucide-react';
import aeSimHeroImage from '../../Dashboard/Hero/images/ae-sim-hero-image.webp';
import '../../Dashboard/Hero/Hero.css';
import './TrainingSimulators.css';

import trainingStaticImg from './images/training_static_rig.jpg';
import training3dofImg from './images/training_3dof_rig.jpg';
import training6dofImg from './images/training_6dof_rig.jpg';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function TrainingSimulators({ navigate, activeSubtype = 'all' }) {
  const heroRef = useRef(null);
  const bgLayerRef = useRef(null);
  const midLayerRef = useRef(null);
  const fgLayerRef = useRef(null);
  const textLayerRef = useRef(null);

  const [show3DofKinematics, setShow3DofKinematics] = useState(false);
  const [show6DofKinematics, setShow6DofKinematics] = useState(false);

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

  useEffect(() => {
    if (activeSubtype && activeSubtype !== 'all') {
      const scrollToSection = () => {
        const el = document.getElementById(`section-${activeSubtype}`);
        if (el) {
          const headerOffset = 110;
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      };

      // Perform initial scroll attempt and multi-stage retries to handle 3D/image layout shifts
      scrollToSection();
      const t1 = setTimeout(scrollToSection, 150);
      const t2 = setTimeout(scrollToSection, 450);
      const t3 = setTimeout(scrollToSection, 900);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [activeSubtype]);

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
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem 2rem', marginTop: '1.5rem', width: 'fit-content' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#E31B23', fontSize: '1.2rem' }}>•</span>
                  <span style={{ color: '#000000', fontWeight: 600, fontSize: '0.95rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Motion Platform</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#E31B23', fontSize: '1.2rem' }}>•</span>
                  <span style={{ color: '#000000', fontWeight: 600, fontSize: '0.95rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Real Road Dynamics</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#E31B23', fontSize: '1.2rem' }}>•</span>
                  <span style={{ color: '#000000', fontWeight: 600, fontSize: '0.95rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Driver Evaluation</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#E31B23', fontSize: '1.2rem' }}>•</span>
                  <span style={{ color: '#000000', fontWeight: 600, fontSize: '0.95rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Professional Training</span>
                </div>
              </div>

            </div>
          </div>
        </section>
      </div>

      <div className="training-container" style={{ paddingTop: '50px' }}>
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

        {/* SECTION 1: STATIC TRAINING SIMULATORS */}
        <ScrollReveal variant="fade-up">
          <section id="section-static" className="simulator-section-block">
            <span className="section-eyebrow">STATIC CABINS</span>
            <h2 className="simulator-section-title">STATIC DRIVER TRAINING SIMULATORS</h2>
            <p className="simulator-section-subtitle">
              Institutional Cabin Cockpits for Fleet Safety, Academies &amp; Commercial Driving
            </p>

            <div className="simulator-section-grid">
              <div className="simulator-image-card">
                <ProtectedImage
                  src={trainingStaticImg}
                  alt="Static Driver Training Simulator Platform"
                />
                <div className="simulator-image-overlay" />
              </div>

              <div className="simulator-info-content">
                <p className="simulator-info-desc">
                  Institutional-grade static driving simulator cabins equipped with authentic vehicle controls, force-feedback steering, transmission shifters, multi-screen visual display systems, and real-road simulation software for fleet safety training, driving academies, and R&amp;D evaluation.
                </p>



                <button
                  type="button"
                  className="contact-us-red-btn"
                  style={{ alignSelf: 'flex-start' }}
                  onClick={(e) => handleNavigate('/contact', e)}
                >
                  ENQUIRE FOR STATIC TRAINING <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                </button>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* SECTION 2: 3-DOF MOTION TRAINING SIMULATORS */}
        <ScrollReveal variant="fade-up">
          <section id="section-3dof" className="simulator-section-block">
            <span className="section-eyebrow">3-DOF MOTION PLATFORMS</span>
            <h2 className="simulator-section-title">3-DOF DYNAMIC MOTION TRAINING SIMULATORS</h2>
            <p className="simulator-section-subtitle">
              Dynamic Tilt, Lean &amp; Elevation Motion Feedback
            </p>

            <div className="simulator-section-grid reverse">
              <div className="simulator-info-content">
                <p className="simulator-info-desc">
                  Compact 3-DOF motion platform providing precise pitch, roll, and heave forces ideal for driver training, qualification, hazard response, and tactical maneuver simulation under dynamic road conditions.
                </p>



                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '1rem' }}>
                  <button
                    type="button"
                    className="contact-us-red-btn"
                    onClick={(e) => handleNavigate('/contact', e)}
                  >
                    ENQUIRE FOR 3-DOF TRAINING <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                  </button>
                  <button
                    type="button"
                    className="motion-test-btn"
                    onClick={() => setShow3DofKinematics((prev) => !prev)}
                  >
                    <Activity size={16} style={{ marginRight: '8px' }} />
                    {show3DofKinematics ? 'SHOW PRODUCT IMAGE' : 'MOTION TEST'}
                  </button>
                </div>
              </div>

              <div className={`simulator-image-card ${show3DofKinematics ? 'kinematics-active' : ''}`}>
                {show3DofKinematics ? (
                  <ThreeDofImageViewer height="100%" />
                ) : (
                  <>
                    <ProtectedImage
                      src={training3dofImg}
                      alt="3-DOF Motion Training Driving Simulator"
                    />
                    <div className="simulator-image-overlay" />
                  </>
                )}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* SECTION 3: 6-DOF TRAINING SIMULATORS */}
        <ScrollReveal variant="fade-up">
          <section id="section-6dof" className="simulator-section-block">
            <span className="section-eyebrow">6-DOF MOTION PLATFORMS</span>
            <h2 className="simulator-section-title">6-DOF RESEARCH &amp; DEFENSE SIMULATORS</h2>
            <p className="simulator-section-subtitle">
              Complete Multi-Axis Motion Dynamics &amp; Vehicle Research
            </p>

            <div className="simulator-section-grid">
              <div className={`simulator-image-card ${show6DofKinematics ? 'kinematics-active' : ''}`}>
                {show6DofKinematics ? (
                  <SixDofImageViewer height="100%" />
                ) : (
                  <>
                    <ProtectedImage
                      src={training6dofImg}
                      alt="6-DOF Driver Training Simulator Platform"
                    />
                    <div className="simulator-image-overlay" />
                  </>
                )}
              </div>

              <div className="simulator-info-content">
                <p className="simulator-info-desc">
                  Full 6-DOF motion platform providing complete multi-directional tilt, turn, acceleration, and elevation motion for extreme realism in defense driver training, automotive OEM research, and driver evaluation.
                </p>



                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '1rem' }}>
                  <button
                    type="button"
                    className="contact-us-red-btn"
                    onClick={(e) => handleNavigate('/contact', e)}
                  >
                    ENQUIRE FOR 6-DOF TRAINING <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                  </button>
                  <button
                    type="button"
                    className="motion-test-btn"
                    onClick={() => setShow6DofKinematics((prev) => !prev)}
                  >
                    <Activity size={16} style={{ marginRight: '8px' }} />
                    {show6DofKinematics ? 'SHOW PRODUCT IMAGE' : 'MOTION TEST'}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
}
