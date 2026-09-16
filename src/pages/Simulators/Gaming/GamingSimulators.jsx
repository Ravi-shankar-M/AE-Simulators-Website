import React, { useState, useEffect } from 'react';
import ScrollReveal from '../../../components/common/ScrollReveal';
import ProtectedImage from '../../../components/common/ProtectedImage';
import ThreeDofImageViewer from '../../../components/three/ThreeDofImageViewer';
import SixDofImageViewer from '../../../components/three/SixDofImageViewer';
import ActuatorScrollExperience from '../ActuatorSequence/ActuatorSequence';
import { ShieldCheck, ArrowRight, Activity } from 'lucide-react';
import './GamingSimulators.css';

import gamingStaticImg from './images/gaming_static_rig.jpg';
import gaming3dofImg from './images/gaming_3dof_rig.png';
import gaming6dofImg from './images/gaming_6dof_rig.jpg';

export default function GamingSimulatorsPage({ navigate, activeSubtype = 'all' }) {
  const [show3DofKinematics, setShow3DofKinematics] = useState(false);
  const [show6DofKinematics, setShow6DofKinematics] = useState(false);

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
    <div className="gaming-page-wrapper">
      <div className="gaming-container">
        {/* GAMING HERO HEADER */}
        <ScrollReveal variant="fade-up">
          <div className="gaming-hero-header">
            <h1 className="gaming-hero-title">
              GAMING <span className="text-ae-red">SIMULATORS</span>
            </h1>
            <p className="gaming-hero-desc">
              High-performance motion platforms and sim racing cockpits engineered for esports competitions, commercial gaming centers, and extreme home sim rigs.
            </p>
          </div>
        </ScrollReveal>
      </div>

      {/* 3D SEQUENCE SCROLL TRIGGER MODEL */}
      <ActuatorScrollExperience navigate={navigate} />

      <div className="gaming-container" style={{ marginTop: '2.5rem' }}>
        {/* SECTION 1: STATIC SIMULATORS */}
        <ScrollReveal variant="fade-up">
          <section id="section-static" className="simulator-section-block">
            <span className="section-eyebrow">STATIC RIGS</span>
            <h2 className="simulator-section-title">STATIC SIM RACING COCKPITS</h2>
            <p className="simulator-section-subtitle">
              Precision Ergonomics, High-Rigidity Aluminum &amp; Direct Drive Wheel Support
            </p>

            <div className="simulator-section-grid">
              <div className="simulator-image-card">
                <ProtectedImage
                  src={gamingStaticImg}
                  alt="Static Sim Racing Cockpit Rig"
                />
                <div className="simulator-image-overlay" />
              </div>

              <div className="simulator-info-content">
                <p className="simulator-info-desc">
                  Engineering-grade static sim racing cockpits built for high-end esports competition, home sim racing setups, and commercial entertainment centers. Constructed with heavy-duty aluminum extrusions to eliminate flex under intense steering wheel torque and heavy pedal braking.
                </p>



                <button
                  type="button"
                  className="contact-us-red-btn"
                  style={{ alignSelf: 'flex-start' }}
                  onClick={(e) => handleNavigate('/contact', e)}
                >
                  ENQUIRE FOR STATIC RIG <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                </button>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* SECTION 2: 3-DOF MOTION SIMULATORS */}
        <ScrollReveal variant="fade-up">
          <section id="section-3dof" className="simulator-section-block">
            <span className="section-eyebrow">3-DOF DYNAMIC MOTION</span>
            <h2 className="simulator-section-title">3-DOF DYNAMIC MOTION SIMULATORS</h2>
            <p className="simulator-section-subtitle">
              Dynamic Tilt, Roll &amp; Elevation Motion
            </p>

            <div className="simulator-section-grid reverse">
              <div className="simulator-info-content">
                <p className="simulator-info-desc">
                  Dynamic 3-DOF motion platform bringing real-road chassis G-forces, suspension bumps, and apex cornering inertia straight into your racing cockpit. Powered by 3 high-speed smooth electric motors with instant response time.
                </p>



                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '1rem' }}>
                  <button
                    type="button"
                    className="contact-us-red-btn"
                    onClick={(e) => handleNavigate('/contact', e)}
                  >
                    ENQUIRE FOR 3-DOF RIG <ArrowRight size={16} style={{ marginLeft: '8px' }} />
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
                      src={gaming3dofImg}
                      alt="3-DOF Motion Gaming Simulator Rig"
                    />
                    <div className="simulator-image-overlay" />
                  </>
                )}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* SECTION 3: 6-DOF SIMULATORS */}
        <ScrollReveal variant="fade-up">
          <section id="section-6dof" className="simulator-section-block">
            <span className="section-eyebrow">6-DOF MOTION RIGS</span>
            <h2 className="simulator-section-title">6-DOF DYNAMIC MOTION SIMULATORS</h2>
            <p className="simulator-section-subtitle">
              Full Motion Immersion For Extreme Driving Experience
            </p>

            <div className="simulator-section-grid">
              <div className={`simulator-image-card ${show6DofKinematics ? 'kinematics-active' : ''}`}>
                {show6DofKinematics ? (
                  <SixDofImageViewer height="100%" />
                ) : (
                  <>
                    <ProtectedImage
                      src={gaming6dofImg}
                      alt="6-DOF Motion Simulator"
                    />
                    <div className="simulator-image-overlay" />
                  </>
                )}
              </div>

              <div className="simulator-info-content">
                <p className="simulator-info-desc">
                  Full 6-DOF platform providing complete tilt, lean, turn, slide, and vertical motion feedback for maximum immersion in pro sim racing, esports centers, and high-payload cockpits.
                </p>



                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '1rem' }}>
                  <button
                    type="button"
                    className="contact-us-red-btn"
                    onClick={(e) => handleNavigate('/contact', e)}
                  >
                    ENQUIRE FOR 6-DOF RIG <ArrowRight size={16} style={{ marginLeft: '8px' }} />
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
