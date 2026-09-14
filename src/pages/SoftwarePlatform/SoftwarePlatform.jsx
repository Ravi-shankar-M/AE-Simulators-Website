import React, { useState } from 'react';
import ScrollReveal from '../../components/common/ScrollReveal';
import { ShieldAlert, CheckCircle2, FileText, BarChart3, ShieldCheck } from 'lucide-react';
import './SoftwarePlatform.css';

export default function SoftwarePlatformPage({ navigate }) {
  const [activeScenario, setActiveScenario] = useState('REAL_ROAD');

  const scenarios = {
    REAL_ROAD: {
      title: 'REAL ROAD PHYSICS ENGINE',
      subtitle: 'Deterministic Vehicle Dynamics & Surface Modeling',
      desc: 'Accurate multi-surface road friction (asphalt, wet pavement, gravel, icy patches), precise lane geometry, variable banking, and gradient elevations.',
      features: ['Sub-millisecond physics loop', 'Variable tire friction curves', 'Dynamic elevation & camber modeling']
    },
    TRAFFIC: {
      title: 'MULTI-AGENT TRAFFIC SIMULATION',
      subtitle: 'Autonomous AI Traffic Behaviors & Highway Merging',
      desc: 'Configurable traffic density featuring passenger cars, heavy commercial trucks, emergency vehicles, and unpredictable pedestrian incursions.',
      features: ['Configurable traffic density', 'Autonomous car-following models', 'Sudden lane change behaviors']
    },
    OBSTACLES: {
      title: 'OBSTACLE INJECTION & HAZARDS',
      subtitle: 'Emergency Hazard Reaction & Avoidance Assessment',
      desc: 'Real-time hazard triggers including fallen cargo, sudden pedestrian road crossing, stationary stalled vehicles, and debris avoidance.',
      features: ['Dynamic hazard trigger events', 'Time-to-collision (TTC) logging', 'Evasive maneuver scoring']
    },
    PARKING: {
      title: 'PARKING & TIGHT MANEUVER MODULE',
      subtitle: 'Precision Bay, Parallel & Perpendicular Parking',
      desc: 'Sub-centimeter proximity sensing evaluating mirror placement, blind-spot checks, turning clearance, and multi-point parking execution.',
      features: ['Clearance proximity heatmaps', 'Blind-spot mirror verification', 'Curbside clearance metrics']
    },
    REVERSE_DRIVING: {
      title: 'REVERSE DRIVING & GUIDANCE',
      subtitle: 'Commercial & Passenger Vehicle Reverse Navigation',
      desc: 'Evaluates driver rear-view mirror utilization, reversing trajectory smoothness, speed control, and rear obstacle clearance compliance.',
      features: ['Mirror tracking analytics', 'Reversing path deviation logger', 'Clearance alert thresholds']
    },
    TURNING_UTURN: {
      title: 'TURNING & U-TURN KINEMATICS',
      subtitle: 'Intersection Clearance & Tight Turning Radii',
      desc: 'Analyzes apex positioning, turn signal activation timing, cross-traffic gaps, and tight radius U-turn steering control.',
      features: ['Intersection gap-acceptance model', 'Turn signal timing validation', 'Steering lock angle tracking']
    },
    SIGNALS: {
      title: 'TRAFFIC SIGNAL & STATE LOGIC',
      subtitle: 'Full Intersection State Machine Compliance',
      desc: 'Monitors driver reaction to amber light transitions, stop line compliance, right-of-way rules, and pedestrian signal priority.',
      features: ['Amber light decision dilemma logging', 'Stop-line over-run detection', 'Right-of-way compliance']
    },
    DAY_NIGHT: {
      title: 'DAY / NIGHT & DYNAMIC LIGHTING',
      subtitle: 'Atmospheric Lighting, Headlight Glare & Weather',
      desc: 'Seamless transition between bright sunlight, sunset glare, pitch-dark nighttime driving, rain, fog, and wet road reflections.',
      features: ['High-contrast headlight beam glare', 'Dynamic rain & fog density', 'Low-visibility driver response']
    }
  };

  return (
    <div className="software-page-container">
      {/* HERO SECTION */}
      <section className="hero-section text-hero-clean">
        <ScrollReveal variant="fade-up">
          <div className="section-content hero-content">
            <div className="tech-badge">
              <span className="badge-dot" />
              SIMULATOR SOFTWARE PLATFORM
            </div>

            <h1 className="hero-title">
              REAL-ROAD <span className="text-ae-red">SIMULATION</span>
            </h1>

            <p className="hero-subtext">
              Professional simulation engine combining deterministic road physics, intelligent multi-agent AI traffic, dynamic environmental lighting, and comprehensive collision detection.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* SCENARIO EXPLORER */}
      <section className="section-block scenario-explorer-section">
        <ScrollReveal variant="fade-up">
          <div className="section-header">
            <span className="section-num font-mono text-ae-red">SCENARIO ENGINE</span>
            <h2 className="section-title">REALISTIC DRIVING SCENARIOS</h2>
            <p className="section-desc">
              Explore our specialized scenario modules engineered for comprehensive driver evaluation and institutional training.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="scale-up" delay={0.1}>
          <div className="scenario-grid-container">
            <div className="scenario-nav-menu">
              {Object.keys(scenarios).map((key) => (
                <button
                  key={key}
                  className={`scenario-nav-btn font-mono ${activeScenario === key ? 'active' : ''}`}
                  onClick={() => setActiveScenario(key)}
                >
                  <span className="btn-indicator" />
                  {scenarios[key].title.split(' ')[0]} {scenarios[key].title.split(' ')[1] || ''}
                </button>
              ))}
            </div>

            <div className="scenario-display-card ae-card">
              <div className="scenario-card-header">
                <span className="font-mono text-ae-red text-xs">MODULE ARCHITECTURE</span>
                <h3>{scenarios[activeScenario].title}</h3>
                <p className="scenario-card-sub font-mono">{scenarios[activeScenario].subtitle}</p>
              </div>

              <p className="scenario-card-body">{scenarios[activeScenario].desc}</p>

              <div className="scenario-features">
                <span className="font-mono text-dim text-xs">KEY EVALUATION METRICS:</span>
                <div className="feature-tags">
                  {scenarios[activeScenario].features.map((feat, idx) => (
                    <div key={idx} className="feat-tag font-mono">
                      <CheckCircle2 size={14} className="text-ae-red" />
                      {feat}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* COLLISION DETECTION & SAFETY */}
      <section className="section-block collision-safety-section">
        <ScrollReveal variant="fade-up">
          <div className="section-header">
            <span className="section-num font-mono text-ae-red">SAFETY MATRIX</span>
            <h2 className="section-title">COLLISION DETECTION & HAZARD LOGGING</h2>
            <p className="section-desc">
              Continuous bounding-box clearance monitoring calculating Time-to-Collision (TTC), lane departure warnings, and impact force vectors.
            </p>
          </div>
        </ScrollReveal>

        <div className="safety-grid">
          <ScrollReveal variant="scale-up" delay={0.1}>
            <div className="ae-card">
              <ShieldAlert size={28} className="text-ae-red mb-3" />
              <h3>Real-Time Proximity Alerting</h3>
              <p>Sub-centimeter mesh collision detection calculating relative speed vectors between the ego vehicle and static/dynamic obstacles.</p>
            </div>
          </ScrollReveal>
          <ScrollReveal variant="scale-up" delay={0.2}>
            <div className="ae-card">
              <BarChart3 size={28} className="text-ae-red mb-3" />
              <h3>Impact Telemetry Recording</h3>
              <p>Log exact impact speed, contact point geometry, driver pedal state prior to impact, and seatbelt strain telemetry.</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* DRIVER EVALUATION & REPORTING SHOWCASE */}
      <section className="section-block driver-reports-section">
        <ScrollReveal variant="fade-up">
          <div className="reports-container">
            <div className="reports-text-side">
              <span className="section-num font-mono text-ae-red">EVALUATION DASHBOARD</span>
              <h2 className="section-title">DRIVER SCORING & PERFORMANCE REPORTS</h2>
              <p className="section-desc">
                Every driving session automatically generates a comprehensive evaluation report analyzing speed adherence, smooth inputs, signal compliance, and emergency hazard response.
              </p>

              <div className="report-features-list font-mono">
                <div className="report-item">
                  <FileText size={18} className="text-ae-red" />
                  <span>Automated Performance Score (0–100 Rating)</span>
                </div>
                <div className="report-item">
                  <BarChart3 size={18} className="text-ae-red" />
                  <span>Steering, Throttle & Brake Graph Analysis</span>
                </div>
                <div className="report-item">
                  <ShieldCheck size={18} className="text-ae-red" />
                  <span>Traffic Violation & Safety Infraction Breakdown</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}

