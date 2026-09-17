import React from 'react';
import ScrollReveal from '../../../components/common/ScrollReveal';
import { ShieldCheck, Cpu, Sliders } from 'lucide-react';

import './Philosophy.css';

import imgMotion from './images/motion_engineering.png';
import imgSoftware from './images/software_simulation.png';
import imgDriver from './images/driver_evaluation.png';
export default function Philosophy() {
  return (
    <section className="about-philosophy-section">
      <ScrollReveal variant="fade-up">
        <div className="section-header center-header" style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <h2 className="section-title font-heading" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800 }}>
            ENGINEERING &amp; SIMULATION PRECISION
          </h2>
          <div className="section-title-line" style={{ margin: '0 auto' }} />
          <p className="section-desc font-body" style={{ maxWidth: '820px', margin: '1rem auto 0', fontSize: '1.05rem', lineHeight: '1.65' }}>
            Operating under our parent company <strong>AE AUTOMATION ENGINEERS</strong>, <strong>AE Simulators</strong> bridges physical mechanical engineering with deterministic virtual simulation environments to create professional-grade training systems.
          </p>
        </div>
      </ScrollReveal>

      <div className="about-grid">
        <ScrollReveal variant="scale-up" delay={0.1}>
          <div className="ae-card" style={{ padding: 0, overflow: 'hidden' }}>
            <img src={imgMotion} alt="Motion Engineering" loading="lazy" style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
            <div style={{ padding: '24px' }}>
              <h3 className="font-heading text-lg font-bold mb-2" style={{ fontSize: '1.15rem', fontWeight: 800 }}>Motion Engineering</h3>
              <p className="font-body text-gray-600 text-sm" style={{ color: '#555B63', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Designing 3-DOF and 6-DOF electromechanical motion platforms engineered for high load capacities, rapid linear acceleration, and sub-millimeter positional control.
              </p>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="scale-up" delay={0.2}>
          <div className="ae-card" style={{ padding: 0, overflow: 'hidden' }}>
            <img src={imgSoftware} alt="Software Simulation" loading="lazy" style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
            <div style={{ padding: '24px' }}>
              <h3 className="font-heading text-lg font-bold mb-2" style={{ fontSize: '1.15rem', fontWeight: 800 }}>Software Simulation</h3>
              <p className="font-body text-gray-600 text-sm" style={{ color: '#555B63', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Developing realistic road environments, multi-agent AI traffic models, hazard injection engines, and real-time driver evaluation metrics.
              </p>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="scale-up" delay={0.3}>
          <div className="ae-card" style={{ padding: 0, overflow: 'hidden' }}>
            <img src={imgDriver} alt="Driver Evaluation" loading="lazy" style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
            <div style={{ padding: '24px' }}>
              <h3 className="font-heading text-lg font-bold mb-2" style={{ fontSize: '1.15rem', fontWeight: 800 }}>Driver Evaluation</h3>
              <p className="font-body text-gray-600 text-sm" style={{ color: '#555B63', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Building automated scoring and telemetry analysis tools to transform raw session data into clear, objective driver performance reports.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
