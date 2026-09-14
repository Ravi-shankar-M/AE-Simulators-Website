import React, { useState } from 'react';
import ProtectedImage from '../../../components/common/ProtectedImage';
import { AlertTriangle, Navigation, RotateCcw, TrafficCone, ShieldCheck, Moon, Car } from 'lucide-react';

import './Technology.css';
import realisticDrivingImg from './images/realistic_driving.webp';

const SCENARIOS = [
  {
    id: 'REAL ROADS',
    title: 'Real Road Environments',
    icon: Car,
    desc: 'Accurate asphalt friction, elevation gradients, banking angles, lane markings, and structural highway geometry.',
    hud: { speed: '84 km/h', friction: '0.85 µ', gradient: '+2.4°', laneDev: '0.04 m' }
  },
  {
    id: 'TRAFFIC',
    title: 'Autonomous Traffic Agents',
    icon: Car,
    desc: 'Multi-agent AI traffic performing realistic merging, distance keeping, lane changes, and emergency maneuvers.',
    hud: { agents: '24 vehicles', density: 'High', safetyMargin: '14.2 m', risk: 'Low' }
  },
  {
    id: 'OBSTACLES',
    title: 'Obstacles & Emergency Braking',
    icon: AlertTriangle,
    desc: 'Randomized obstacle injection, sudden pedestrian crosswalk events, and emergency hazard response testing.',
    hud: { reactionTime: '0.34 s', brakeDist: '18.2 m', hazardStatus: 'Active', outcome: 'Pass' }
  },
  {
    id: 'PARKING',
    title: 'Parallel & Bay Parking',
    icon: Navigation,
    desc: 'Tight space clearance evaluation, parallel parking guidance, and curb collision proximity alerts.',
    hud: { curbDist: '0.12 m', clearance: '0.28 m', maneuvers: '3 steps', score: '98/100' }
  },
  {
    id: 'REVERSE DRIVING',
    title: 'Reverse Driving Control',
    icon: RotateCcw,
    desc: 'Rear mirror clearance tracking, reverse slalom control, and blind-spot guidance under constrained spaces.',
    hud: { rearSensor: 'Clear', steerSmooth: '94%', speedCap: '12 km/h', alignment: '0.02°' }
  },
  {
    id: 'TURNING',
    title: 'Turning & U-Turn Geometry',
    icon: TrafficCone,
    desc: 'Intersection turning radii, tight U-turn control, steering lock tracking, and roll-rate stability.',
    hud: { turnRadius: '6.4 m', lockAngle: '34.2°', slipRatio: '0.04', G_lat: '0.42 G' }
  },
  {
    id: 'SIGNALS',
    title: 'Traffic Signal Compliance',
    icon: ShieldCheck,
    desc: 'Intersection signal state machine, dilemma zone assessment, red light violation tracking, and stop lines.',
    hud: { signalState: 'Amber', stopLineDist: '4.2 m', compliance: '100%', penalty: '0' }
  },
  {
    id: 'DAY NIGHT',
    title: 'Day / Night & Weather Cycles',
    icon: Moon,
    desc: 'Dynamic solar orientation, night driving headlight glare, heavy rain, fog, and wet asphalt reflections.',
    hud: { illumination: '12 Lux', visibility: '45 m', roadWetness: '80%', wipers: 'Auto' }
  }
];

export default function Technology() {
  const [activeScenario, setActiveScenario] = useState(SCENARIOS[0]);

  return (
    <section id="software" className="technology-section">
      <div className="technology-container">
        <div className="section-header">
          <span className="section-sublabel font-mono">03 — SOFTWARE ENGINE</span>
          <h2 className="section-title">SIMULATOR SOFTWARE ENGINE</h2>
          <p className="section-desc">
            Interactive simulation engine engineered for driver assessment, vehicle dynamic testing, and institutional safety qualification.
          </p>
        </div>

        {/* INTERACTIVE SCENARIO CANVAS */}
        <div className="software-preview-box">
          <div className="software-hud-bar font-mono">
            <div className="hud-badge text-ae-red" style={{ color: '#E31B23', fontWeight: 700 }}>
              <span style={{ color: '#E31B23' }}>●</span> AE SIMULATION ENGINE — {activeScenario.id}
            </div>
            <div className="hud-status text-xs text-ae-red" style={{ color: '#E31B23' }}>
              STATE: ACTIVE SIMULATION
            </div>
          </div>

          <div className="software-main-canvas">
            <div className="software-img-wrapper">
              <ProtectedImage
                src={realisticDrivingImg}
                alt="AE Simulator Software Environment"
                className="software-preview-img"
              />

              {/* LIVE TELEMETRY OVERLAY CARD ON SCREEN */}
              <div className="software-telemetry-hud font-mono">
                <span className="telemetry-title">LIVE HUD SCENARIO METRICS</span>
                <div className="telemetry-grid">
                  {Object.entries(activeScenario.hud).map(([k, v]) => (
                    <div key={k} className="metric-cell">
                      <span className="metric-k">{k.toUpperCase()}</span>
                      <strong className="metric-v">{v}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* INTERACTIVE SCENARIOS TABS */}
          <div className="scenarios-tabs-row font-mono">
            {SCENARIOS.map((sc) => {
              const isSelected = activeScenario.id === sc.id;
              return (
                <button
                  key={sc.id}
                  type="button"
                  className={`scenario-tab-btn ${isSelected ? 'active' : ''}`}
                  onClick={() => setActiveScenario(sc)}
                >
                  <span>{sc.title}</span>
                </button>
              );
            })}
          </div>

          <div className="active-scenario-description">
            <h4>{activeScenario.title}</h4>
            <p>{activeScenario.desc}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
