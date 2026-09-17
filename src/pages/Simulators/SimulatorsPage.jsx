import React from 'react';
import ScrollReveal from '../../components/common/ScrollReveal';
import Gaming360Viewer from '../../components/three/Gaming360Viewer';
import Products from '../About/Products/Products';
import './SimulatorsPage.css';

export default function SimulatorsPage({ navigate }) {
  return (
    <div className="simulators-landing-wrapper font-body">
      <div className="simulators-landing-container">
        {/* HERO HEADER */}
        <ScrollReveal variant="fade-up">
          <div className="simulators-landing-header">
            <span className="section-eyebrow font-mono">SIMULATION ECOSYSTEMS</span>
            <h1 className="simulators-landing-title font-heading">
              AE-SIMULATORS <span className="text-ae-red">PRODUCT LINEUP</span>
            </h1>
          </div>
        </ScrollReveal>

        {/* 1. TOP SECTION: 360° INTERACTIVE COCKPIT MODEL */}
        <ScrollReveal variant="fade-up">
          <div className="simulators-360-block" style={{ marginBottom: '5rem' }}>
            <div className="simulators-section-header text-center mb-6">
              <span className="font-mono text-xs text-ae-red uppercase tracking-wider block mb-2">INTERACTIVE 3D EXPLORER</span>
              <h2 className="simulators-section-title font-heading" style={{ fontSize: '2.2rem', fontWeight: 900 }}>
                360° INTERACTIVE <span className="text-ae-red">COCKPIT MODEL</span>
              </h2>
            </div>
            <Gaming360Viewer height="560px" />
          </div>
        </ScrollReveal>

        {/* 2. NEXT SECTION: GAMING SIMULATORS & TRAINING SIMULATORS SHOWCASE CARDS */}
        <ScrollReveal variant="fade-up">
          <div className="simulators-products-block">
            <Products navigate={navigate} />
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
