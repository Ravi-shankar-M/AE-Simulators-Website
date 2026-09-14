import React from 'react';

export default function TrainingScenarios() {
  const scenarios = [
    { title: 'REAL ROAD', desc: 'Urban highways, mountain passes, and rural road networks.' },
    { title: 'TRAFFIC DYNAMICS', desc: 'Interactive AI vehicles with adaptive braking and merging.' },
    { title: 'PARKING CONTROL', desc: 'Parallel, perpendicular, and tight garage parking modules.' },
    { title: 'REVERSE DRIVING', desc: 'Precision mirror maneuvering and blind spot awareness.' },
    { title: 'U-TURN MANEUVER', desc: 'Tight radius turning and multi-lane crossover safety.' },
    { title: 'HAZARD OBSTACLES', desc: 'Sudden pedestrian crossings and wet road skid recovery.' },
    { title: 'TRAFFIC SIGNALS', desc: 'Complex intersections, traffic lights, and right-of-way rules.' },
    { title: 'DAY / NIGHT & RAIN', desc: 'Fog, torrential rain, glare, and low-visibility night driving.' },
  ];

  return (
    <section id="scenarios" className="section-container">
      <div className="section-header">
        <span className="section-headline-eyebrow">TRAINING CURRICULUM</span>
        <h2 className="section-headline">
          COMPREHENSIVE <span>TRAINING SCENARIOS.</span>
        </h2>
        <p className="section-description">
          Prepare drivers for every road condition with our library of realistic training modules.
        </p>
      </div>

      <div className="scenarios-grid">
        {scenarios.map((sc, index) => (
          <div key={index} className="scenario-card">
            <h3 className="scenario-title">{sc.title}</h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.6rem', lineHeight: '1.5' }}>
              {sc.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
