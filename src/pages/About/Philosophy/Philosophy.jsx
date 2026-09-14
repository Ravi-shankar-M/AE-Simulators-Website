import React from 'react';
import ScrollReveal from '../../../components/common/ScrollReveal';
import { ShieldCheck, Cpu, Sliders } from 'lucide-react';

import './Philosophy.css';

export default function Philosophy() {
  return (
    <section className="about-philosophy-section">
      <ScrollReveal variant="fade-up">
        <div className="section-header center-header" style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <h2 className="section-title font-heading" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800 }}>
            ENGINEERING &amp; SIMULATION PRECISION
          </h2>
          <div className="section-title-line" style={{ margin: '0 auto' }} />
          <p className="section-desc font-body" style={{ maxWidth: '780px', margin: '1rem auto 0', fontSize: '1.05rem', lineHeight: '1.65' }}>
            At <strong>AE Simulators</strong>, we bridge physical mechanical engineering with deterministic virtual simulation environments.
          </p>
        </div>
      </ScrollReveal>

      <div className="about-grid">
        <ScrollReveal variant="scale-up" delay={0.1}>
          <div className="ae-card">
            <Sliders size={28} style={{ color: '#E31B23', marginBottom: '12px' }} />
            <h3 className="font-heading text-lg font-bold mb-2" style={{ fontSize: '1.15rem', fontWeight: 800 }}>Motion Engineering</h3>
            <p className="font-body text-gray-600 text-sm" style={{ color: '#555B63', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Designing 3-DOF tripod and 6-DOF Stewart electromechanical actuator platforms engineered for high load capacities, rapid linear acceleration, and sub-millimeter positional control.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="scale-up" delay={0.2}>
          <div className="ae-card">
            <Cpu size={28} style={{ color: '#E31B23', marginBottom: '12px' }} />
            <h3 className="font-heading text-lg font-bold mb-2" style={{ fontSize: '1.15rem', fontWeight: 800 }}>Software Simulation</h3>
            <p className="font-body text-gray-600 text-sm" style={{ color: '#555B63', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Developing realistic road environments, multi-agent AI traffic models, hazard injection engines, and real-time driver evaluation metrics.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="scale-up" delay={0.3}>
          <div className="ae-card">
            <ShieldCheck size={28} style={{ color: '#E31B23', marginBottom: '12px' }} />
            <h3 className="font-heading text-lg font-bold mb-2" style={{ fontSize: '1.15rem', fontWeight: 800 }}>Driver Evaluation</h3>
            <p className="font-body text-gray-600 text-sm" style={{ color: '#555B63', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Building automated scoring and telemetry analysis tools to transform raw session data into clear, objective driver performance reports.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
