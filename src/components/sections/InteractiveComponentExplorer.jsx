import React from 'react';
import { Cpu, Gauge, Layers, Shield, Settings, Monitor, Terminal } from 'lucide-react';
import './Hero3DStory.css';

const SIMULATOR_COMPONENTS = [
  {
    id: 'COCKPIT',
    name: 'Cockpit Architecture & Frame',
    icon: Layers,
    summary: 'Ergonomic chassis frame constructed from industrial steel tubing and composite panels.',
    details: [
      { label: 'FRAME MATERIAL', value: 'High-tensile structural steel' },
      { label: 'SEATING', value: 'Automotive bucket seat' },
      { label: 'SPECIFICATION', value: '[SPECIFICATION TO BE PROVIDED]' }
    ]
  },
  {
    id: 'MOTION PLATFORM',
    name: '6-DOF Stewart Hexapod Platform',
    icon: Cpu,
    summary: 'Stewart hexapod geometry engineered for high-fidelity 6-DOF vehicle dynamics reproduction.',
    details: [
      { label: 'CONFIGURATION', value: '6 Degrees of Freedom' },
      { label: 'KINEMATICS', value: 'Inverse kinematics solver' },
      { label: 'SPECIFICATION', value: '[SPECIFICATION TO BE PROVIDED]' }
    ]
  },
  {
    id: 'ACTUATORS',
    name: 'Precision Actuator Assemblies',
    icon: Gauge,
    summary: 'High-response electric actuator assemblies featuring articulated joints and low friction guidance.',
    details: [
      { label: 'ACTUATOR COUNT', value: '6 articulated actuators' },
      { label: 'JOINTS', value: 'Spherical ball joint ends' },
      { label: 'SPECIFICATION', value: '[SPECIFICATION TO BE PROVIDED]' }
    ]
  },
  {
    id: 'STEERING SYSTEM',
    name: 'Automotive Steering Interface',
    icon: Settings,
    summary: 'Direct-drive feedback motor and GT/Formula steering wheel with integrated input controls.',
    details: [
      { label: 'FEEDBACK', value: 'Force feedback torque motor' },
      { label: 'WHEEL RIM', value: 'Ergonomic tactile grip' },
      { label: 'SPECIFICATION', value: '[SPECIFICATION TO BE PROVIDED]' }
    ]
  },
  {
    id: 'PEDALS',
    name: 'Industrial Pedal Box',
    icon: Shield,
    summary: 'Load-cell pedal assembly providing realistic pedal feel for throttle, progressive brake, and clutch.',
    details: [
      { label: 'SENSORS', value: 'Load-cell pressure sensor' },
      { label: 'MATERIAL', value: 'CNC aluminium' },
      { label: 'SPECIFICATION', value: '[SPECIFICATION TO BE PROVIDED]' }
    ]
  },
  {
    id: 'DISPLAY SYSTEM',
    name: 'Triple Simulation Display Rig',
    icon: Monitor,
    summary: 'Triple monitor mounting framework offering seamless driver field-of-view coverage.',
    details: [
      { label: 'DISPLAY LAYOUT', value: 'Triple panoramic screens' },
      { label: 'MOUNTING', value: 'Vibration isolated frame' },
      { label: 'SPECIFICATION', value: '[SPECIFICATION TO BE PROVIDED]' }
    ]
  },
  {
    id: 'CONTROL CABINET',
    name: 'Power & Motion Control Enclosure',
    icon: Terminal,
    summary: 'Central industrial enclosure housing power distribution, drive controllers, and telemetry interface.',
    details: [
      { label: 'ENCLOSURE', value: 'Industrial steel cabinet' },
      { label: 'INTERFACE', value: 'High-speed ethernet / CAN bus' },
      { label: 'SPECIFICATION', value: '[SPECIFICATION TO BE PROVIDED]' }
    ]
  }
];

export default function InteractiveComponentExplorer({
  activeHotspot,
  setActiveHotspot,
  setHoveredHotspot
}) {
  const currentComp = SIMULATOR_COMPONENTS.find((c) => c.id === activeHotspot) || SIMULATOR_COMPONENTS[0];

  return (
    <section className="section-block section-light-grey component-explorer-section">
      <div className="section-header">
        <span className="section-num font-mono text-ae-red">01 — COMPONENT EXPLORER</span>
        <h2 className="section-title">EXPLORE SIMULATOR HARDWARE</h2>
        <p className="section-desc">
          Select any simulator component to examine its engineering sub-assembly details in 3D.
        </p>
      </div>

      <div className="component-explorer-layout">
        {/* COMPONENT SELECTION LIST */}
        <div className="component-list">
          {SIMULATOR_COMPONENTS.map((comp) => {
            const Icon = comp.icon;
            const isSelected = activeHotspot === comp.id;
            return (
              <div
                key={comp.id}
                className={`component-item-card ae-card ${isSelected ? 'active' : ''}`}
                onClick={() => setActiveHotspot(comp.id)}
                onMouseEnter={() => setHoveredHotspot(comp.id)}
                onMouseLeave={() => setHoveredHotspot(null)}
              >
                <div className="comp-item-left">
                  <div className={`comp-icon-box ${isSelected ? 'active' : ''}`}>
                    <Icon size={20} className={isSelected ? 'text-white' : 'text-ae-red'} />
                  </div>
                  <div className="comp-item-info">
                    <span className="font-mono text-xs text-ae-red">{comp.id}</span>
                    <h4 className="comp-item-name font-heading">{comp.name}</h4>
                  </div>
                </div>
                <span className="comp-arrow">→</span>
              </div>
            );
          })}
        </div>

        {/* ACTIVE COMPONENT DETAIL PANEL */}
        <div className="component-detail-panel ae-card">
          <div className="detail-header font-mono">
            <span className="badge-ae-red">HARDWARE SPECIFICATION</span>
            <span className="detail-id">{currentComp.id}</span>
          </div>

          <h3 className="detail-title font-heading">{currentComp.name}</h3>
          <p className="detail-summary">{currentComp.summary}</p>

          <div className="detail-specs-grid font-mono">
            {currentComp.details.map((d, idx) => (
              <div key={idx} className="spec-box">
                <span className="spec-label">{d.label}</span>
                <strong className="spec-val">{d.value}</strong>
              </div>
            ))}
          </div>

          <div className="detail-footer font-mono">
            <span className="text-ae-red">•</span> Click marker in 3D viewport to inspect related geometry
          </div>
        </div>
      </div>
    </section>
  );
}
