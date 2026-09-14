import React from 'react';
import ScrollReveal from '../../../components/common/ScrollReveal';
import Gaming360Viewer from '../../../components/three/Gaming360Viewer';
import ThreeDofImageViewer from '../../../components/three/ThreeDofImageViewer';
import SixDofImageViewer from '../../../components/three/SixDofImageViewer';
import ActuatorScrollExperience from '../ActuatorSequence/ActuatorSequence';
import WhatWeBuild from '../../Dashboard/WhatWeBuild/WhatWeBuild';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import './GamingSimulators.css';

export default function GamingSimulatorsPage({ navigate }) {
  const handleNavigate = (path, e) => {
    if (e) e.preventDefault();
    if (navigate) navigate(path);
  };

  const gamingProducts = [
    {
      id: '3dof',
      type: '3DOF MOTION GAMING',
      badge: 'TRIPOD MOTION RIG',
      title: '3-DOF SIMULATORS',
      subtitle: 'Rapid Pitch, Roll, & Heave Dynamic Chassis Motion',
      desc: 'Dynamic 3-DOF motion platform bringing real-road chassis G-forces, suspension bumps, and apex cornering inertia straight into your racing cockpit.',
      features: [
        '3 High-speed linear electric actuators',
        'Low-latency Telemetry SDK integration',
        'Pitch (+/- 15 deg), Roll (+/- 15 deg), Heave motion cues',
        'Plug & Play USB motion controller box'
      ],
      spec: '3-DOF TRIPOD'
    },
    {
      id: '6dof',
      type: '6DOF HEXAPOD',
      badge: 'HEXAPOD RIG',
      title: '6-DOF SIMULATORS',
      subtitle: 'Full 6 Degrees of Freedom Extreme Racing Immersion',
      desc: 'Full 6-DOF Hexapod platform providing complete Roll, Pitch, Yaw, Surge, Sway, and Heave motion cues for maximum immersion.',
      features: [
        'Full 6-DOF Hexapod kinematics solver',
        'Instantaneous Surge & Sway G-force translation',
        'Industrial servo-actuator power for high payload cockpits',
        'Pro telemetry software suite with customized motion profiles'
      ],
      spec: '6-DOF HEXAPOD'
    }
  ];

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

      <div className="gaming-container" style={{ marginTop: '2rem' }}>

        {/* 1. 360 VIEW INTERACTIVE MODEL */}
        <ScrollReveal variant="fade-up">
          <div className="gaming-360-section" style={{ marginBottom: '4rem' }}>
            <div className="gaming-section-header">
              <h2 className="gaming-section-title">
                360° INTERACTIVE <span>COCKPIT MODEL</span>
              </h2>
            </div>
            <Gaming360Viewer height="520px" />
          </div>
        </ScrollReveal>

        {/* 2. 3-DOF KINEMATICS & 3. 6-DOF KINEMATICS */}
        <div className="kinematics-section" style={{ marginBottom: '4rem' }}>
          <ScrollReveal variant="fade-up">
            <div className="gaming-section-header">
              <h2 className="gaming-section-title" style={{ color: '#17191C' }}>
                3-DOF &amp; 6-DOF KINEMATICS
              </h2>
            </div>
          </ScrollReveal>

          <div className="training-model-viewers-grid">
            {/* 3-DOF KINEMATICS */}
            <ScrollReveal variant="fade-up">
              <div className="training-viewer-card">
                <div className="training-viewer-header">
                  <h3 className="training-viewer-title">3-DOF KINEMATICS</h3>
                </div>
                <ThreeDofImageViewer height="460px" />
              </div>
            </ScrollReveal>

            {/* 6-DOF KINEMATICS */}
            <ScrollReveal variant="fade-up" delay={0.1}>
              <div className="training-viewer-card">
                <div className="training-viewer-header">
                  <h3 className="training-viewer-title">6-DOF KINEMATICS</h3>
                </div>
                <SixDofImageViewer height="460px" />
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* PRODUCTS CARDS GRID */}
        <div className="gaming-cards-grid">
          {gamingProducts.map((prod) => (
            <ScrollReveal key={prod.id} variant="scale-up">
              <div className="gaming-card ae-card">
                <span className="gaming-card-tag">{prod.badge}</span>
                <h3 className="gaming-card-title">{prod.title}</h3>
                <p className="gaming-card-desc">{prod.desc}</p>

                <ul className="gaming-feature-list">
                  {prod.features.map((feat, fIdx) => (
                    <li key={fIdx} className="gaming-feature-item">
                      <ShieldCheck size={16} className="gaming-feature-icon" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className="contact-us-red-btn full-width"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}
                  onClick={(e) => handleNavigate('/contact', e)}
                >
                  INQUIRE FOR GAMING RIG <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                </button>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>

      {/* WHAT WE BUILD SECTION */}
      <WhatWeBuild navigate={navigate} />
    </div>
  );
}
