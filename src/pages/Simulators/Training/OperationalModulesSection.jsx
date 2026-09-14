import React from 'react';
import './OperationalModulesSection.css';

const MODULES_DATA = [
  { title: 'Real Roads', desc: 'Accurate road geometry, lane markings, elevation changes, and surface friction models.' },
  { title: 'Traffic Simulation', desc: 'Dynamic autonomous traffic agents executing realistic vehicle maneuvers and merging logic.' },
  { title: 'Obstacles & Hazards', desc: 'Obstacle injection, pedestrian crossings, and emergency braking scenarios.' },
  { title: 'Parking Training', desc: 'Parallel, perpendicular, and tight bay parking evaluation with distance telemetry.' },
  { title: 'Reverse Driving', desc: 'Mirror guidance and rear clearance evaluation under constrained space.' },
  { title: 'Turning / U-Turn', desc: 'Intersection turning radii, tight U-turn control, and blind-corner navigation.' },
  { title: 'Traffic Signals', desc: 'Traffic light state machine compliance testing, amber light dilemmas, and stop signs.' },
  { title: 'Day / Night Cycles', desc: 'Dynamic illumination, headlight glare, fog, rain, and reduced visibility driving.' }
];

export default function OperationalModulesSection({ sectionNum = '01 — OPERATIONAL MODULES' }) {
  return (
    <section className="op-modules-section-wrapper" aria-label="Operational Modules">
      <div className="op-modules-content-container">
        
        {/* Header Section */}
        <div className="op-modules-header">
          <span className="section-num font-mono text-ae-red">{sectionNum}</span>
          <h2 className="section-title font-heading">REALISTIC DRIVING SCENARIOS</h2>
          <p className="section-desc font-body">
            Operational scenarios designed to train and evaluate drivers under complex real-world conditions.
          </p>
        </div>

        {/* Horizontal Card Track */}
        <div className="op-modules-track-viewport">
          <div className="op-modules-cards-track">
            {MODULES_DATA.map((item, idx) => (
              <div key={idx} className="op-module-card ae-card">
                <h4 className="op-module-title font-heading">{item.title}</h4>
                <p className="op-module-desc font-body">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
