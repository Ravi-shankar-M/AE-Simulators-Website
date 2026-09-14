import React, { useState } from 'react';

export default function SimulationEnvironment() {
  const [activeHotspot, setActiveHotspot] = useState(0);

  const hotspots = [
    { label: 'REAL ROAD', title: 'Urban & Highway Network Topology', desc: 'Replicates multi-lane expressways, mountain passes, and complex city traffic networks.' },
    { label: 'TRAFFIC', title: 'Adaptive AI Traffic Physics', desc: 'Interactive surrounding vehicles respond dynamically to driver speed and sudden lane changes.' },
    { label: 'OBSTACLES', title: 'Sudden Hazard Avoidance', desc: 'Evaluates driver emergency reaction times against sudden pedestrian crossings and skids.' },
    { label: 'PARKING', title: 'Precision Garage & Parallel Parking', desc: 'Sub-centimeter proximity sensors score mirror alignment and tight space maneuvering.' },
    { label: 'REVERSE', title: 'Blind Spot & Reverse Maneuvering', desc: 'Defensive backing techniques with mirror estimation and reverse trajectory guidance.' },
    { label: 'U-TURN', title: 'Narrow Crossover Turning Radius', desc: 'Multi-lane turning protocols prioritizing pedestrian safety and oncoming vehicle gap awareness.' },
  ];

  return (
    <section id="simulation-env" className="section-container">
      <div className="section-header">
        <span className="section-headline-eyebrow">03 // SIMULATION SCENARIOS</span>
        <h2 className="section-headline">
          CONTROLLED <span>ENVIRONMENT PRACTICE.</span>
        </h2>
        <p className="section-description">
          Click any hotspot below to inspect specific training environment modules.
        </p>
      </div>

      <div className="hotspots-showcase-box">
        {/* Interactive Hotspot Buttons Row */}
        <div className="hotspot-tabs-row">
          {hotspots.map((hs, index) => (
            <button
              key={index}
              onClick={() => setActiveHotspot(index)}
              className={`hotspot-btn ${activeHotspot === index ? 'active' : ''}`}
            >
              <span className="hotspot-dot" />
              <span>{hs.label}</span>
            </button>
          ))}
        </div>

        {/* Active Hotspot Display Panel */}
        <div className="hotspot-active-panel">
          <div className="hotspot-panel-content">
            <span className="tech-mono" style={{ color: '#ff1e27', fontSize: '0.8rem' }}>
              MODULE 0{activeHotspot + 1} // ACTIVE PARAMETER
            </span>
            <h3 className="hotspot-panel-title">{hotspots[activeHotspot].title}</h3>
            <p className="hotspot-panel-desc">{hotspots[activeHotspot].desc}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
