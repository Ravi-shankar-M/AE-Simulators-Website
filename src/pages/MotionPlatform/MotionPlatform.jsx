import React from 'react';
import MotionPlatformKinematics from './MotionPlatformKinematics';
import ActuatorScrollExperience from '../Simulators/ActuatorSequence/ActuatorSequence';
import ScrollReveal from '../../components/common/ScrollReveal';
import ProtectedImage from '../../components/common/ProtectedImage';
import './MotionPlatform.css';

import actuatorDetailImg from './images/ae-motion-actuator-detail.webp';
import simulatorCockpitImg from './images/ae-simulator-cockpit.webp';

export default function MotionPlatformPage({ navigate, type = '6DOF' }) {
  const is3Dof = type === '3DOF';

  const handleNavigate = (path, e) => {
    if (e) e.preventDefault();
    if (navigate) navigate(path);
  };

  return (
    <div className="motion-page-container">
      {/* HERO SECTION */}
      <section className="hero-section text-hero-clean">
        <ScrollReveal variant="fade-up">
          <div className="section-content hero-content">
            <div className="tech-badge">
              <span className="badge-dot" />
              {is3Dof ? '3-DOF COMPACT KINEMATICS' : '6-DOF STEWART HEXAPOD'}
            </div>

            <h1 className="hero-title">
              {is3Dof ? '3-DOF MOTION' : '6-DOF MOTION'} <span className="text-ae-red">PLATFORM</span>
            </h1>

            <p className="hero-subtext">
              {is3Dof
                ? 'Compact 3 Degrees of Freedom electromechanical motion system delivering rapid pitch, roll, and heave chassis feedback for modular simulator setups.'
                : 'Industrial-grade 6 Degrees of Freedom electromechanical motion system delivering high-dynamic force simulation, rapid acceleration response, and heavy-duty structural rigidity.'}
            </p>

            <div className="hero-actions font-mono" style={{ gap: '1rem', display: 'flex', flexWrap: 'wrap' }}>
              <a
                href={is3Dof ? '/motion-platform' : '/3dof-motion-platform'}
                className="btn-secondary hero-quote-btn-secondary"
                style={{ padding: '0.8rem 1.4rem' }}
                onClick={(e) => handleNavigate(is3Dof ? '/motion-platform' : '/3dof-motion-platform', e)}
              >
                SWITCH TO {is3Dof ? '6-DOF PLATFORM' : '3-DOF PLATFORM'}
              </a>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 6-DOF ACTUATOR 3D SCROLL EXPERIENCE */}
      {!is3Dof && <ActuatorScrollExperience navigate={navigate} />}

      {/* INTERACTIVE VISUALIZER FEATURE */}
      <section className="section-block dof-explorer-section">
        <ScrollReveal variant="fade-up">
          <div className="section-header">
            <span className="section-num font-mono text-ae-red">KINEMATICS ARCHITECTURE</span>
            <h2 className="section-title">
              {is3Dof ? '3 DEGREES OF FREEDOM (3-DOF) KINEMATICS' : '6 DEGREES OF FREEDOM (6-DOF) KINEMATICS'}
            </h2>
            <p className="section-desc">
              {is3Dof
                ? 'Explore the motion vector transformations of our electromechanical 3-DOF tripod platform. Toggle AUTO DEMO or select pitch, roll, and heave states.'
                : 'Explore the physical motion vector transformations of our electromechanical 6-DOF Stewart hexapod architecture. Toggle AUTO DEMO or select individual motion states.'}
            </p>
          </div>
        </ScrollReveal>

        {/* INTEGRATED REALISTIC INTERACTIVE KINEMATICS VISUALIZER */}
        <ScrollReveal variant="fade-in" delay={0.2}>
          <MotionPlatformKinematics initialPlatformType={is3Dof ? '3DOF' : '6DOF'} />
        </ScrollReveal>
      </section>

      {/* HARDWARE EDITORIAL BREAKDOWN */}
      <section className="section-block hardware-editorial-section">
        <ScrollReveal variant="fade-up">
          <div className="section-header">
            <span className="section-num font-mono text-ae-red">HARDWARE INTEGRATION</span>
            <h2 className="section-title">MOTION PLATFORM & COCKPIT CHASSIS</h2>
            <p className="section-desc">
              Heavy-duty mechanical assemblies designed for long-life industrial operation, high payload capacity, and precise driver seating placement.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="scale-up" delay={0.1}>
          <div className="editorial-presentation-block">
            <div className="editorial-info-side font-mono">
              <span className="info-label text-ae-red">01 — KINEMATIC DRIVE TECHNOLOGY</span>
              <h3 className="info-heading font-heading">High-Torque Brushless Servos & Ball Screws</h3>
              <p className="info-text font-body">
                Every motion actuator features precision low-backlash ball screws driven by high-torque brushless AC servo motors, providing instantaneous force feedback and zero rotational lag.
              </p>

              <div className="tech-spec-pills font-mono">
                <span className="spec-pill">Sub-Millimeter Positioning</span>
                <span className="spec-pill">High Force Response</span>
                <span className="spec-pill">CAN Bus Interface</span>
              </div>
            </div>

            <div className="editorial-image-side">
              <ProtectedImage
                src={actuatorDetailImg}
                alt="AE Motion Actuator Detail"
                className="editorial-img"
              />
              <span className="editorial-img-caption font-mono">FIG 1.1 — PRECISION ELECTROMECHANICAL ACTUATOR DETAIL</span>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="scale-up" delay={0.2}>
          <div className="editorial-presentation-block mt-5 reverse">
            <div className="editorial-image-side">
              <ProtectedImage
                src={simulatorCockpitImg}
                alt="AE Simulator Cockpit Rig"
                className="editorial-img"
              />
              <span className="editorial-img-caption font-mono">FIG 1.2 — RIGID STEEL COCKPIT CHASSIS INTEGRATION</span>
            </div>

            <div className="editorial-info-side font-mono">
              <span className="info-label text-ae-red">02 — COCKPIT ERGONOMICS</span>
              <h3 className="info-heading font-heading">Rigid Tubular Chassis & Force-Feedback Controls</h3>
              <p className="info-text font-body">
                The upper platform structure features a heavy steel tubular chassis holding load-cell brake pedal assemblies, direct-drive steering servo motors, and authentic vehicle bucket seats.
              </p>

              <div className="tech-spec-pills font-mono">
                <span className="spec-pill">Direct-Drive Wheel Servo</span>
                <span className="spec-pill">Load-Cell Braking</span>
                <span className="spec-pill">Rigid Structural Rig</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* SPECIFICATIONS TABLE */}
      <section className="section-block specs-section">
        <ScrollReveal variant="fade-up">
          <div className="section-header">
            <span className="section-num font-mono text-ae-red">TECHNICAL DATA</span>
            <h2 className="section-title">HARDWARE SPECIFICATIONS</h2>
            <p className="section-desc">
              Official engineering specifications are configured per client deployment requirements.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="scale-up" delay={0.15}>
          <div className="specs-table-container ae-card font-mono">
            <div className="specs-row header-row">
              <span>PARAMETER</span>
              <span>SPECIFICATION</span>
            </div>
            <div className="specs-row">
              <span>Degrees of Freedom</span>
              <span>6-DOF Hexapod (Roll, Pitch, Yaw, Surge, Sway, Heave) / 3-DOF Tripod (Roll, Pitch, Heave)</span>
            </div>
            <div className="specs-row">
              <span>Drive System Type</span>
              <span>SPECIFICATION TO BE PROVIDED</span>
            </div>
            <div className="specs-row">
              <span>Maximum Payload Capacity</span>
              <span>SPECIFICATION TO BE PROVIDED</span>
            </div>
            <div className="specs-row">
              <span>Maximum Linear Acceleration</span>
              <span>SPECIFICATION TO BE PROVIDED</span>
            </div>
            <div className="specs-row">
              <span>Maximum Angular Velocity</span>
              <span>SPECIFICATION TO BE PROVIDED</span>
            </div>
            <div className="specs-row">
              <span>Power Supply Requirements</span>
              <span>SPECIFICATION TO BE PROVIDED</span>
            </div>
            <div className="specs-row">
              <span>Communication Protocol</span>
              <span>High-Speed CAN Bus / Ethernet UDP</span>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}

