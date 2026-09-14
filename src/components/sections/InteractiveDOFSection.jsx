import React, { useState } from 'react';
import { RotateCw, MoveHorizontal, MoveVertical, Compass, ShieldCheck } from 'lucide-react';
import './Hero3DStory.css';

const DOF_MODES = [
  { id: 'RESET', label: 'NEUTRAL (DEFAULT)', icon: ShieldCheck, motion: { roll: 0, pitch: 0, yaw: 0, surge: 0, sway: 0, heave: 0 }, desc: 'Standard neutral position for baseline dynamic stance.' },
  { id: 'ROLL', label: 'ROLL', icon: RotateCw, motion: { roll: 8, pitch: 0, yaw: 0, surge: 0, sway: 0, heave: 0 }, desc: 'Simulates lateral chassis roll during cornering.' },
  { id: 'PITCH', label: 'PITCH', icon: MoveVertical, motion: { roll: 0, pitch: -7, yaw: 0, surge: 0, sway: 0, heave: 0 }, desc: 'Simulates forward pitch under heavy braking or rear pitch during acceleration.' },
  { id: 'YAW', label: 'YAW', icon: Compass, motion: { roll: 0, pitch: 0, yaw: 12, surge: 0, sway: 0, heave: 0 }, desc: 'Simulates vehicle yaw angle during oversteer or rotation.' },
  { id: 'SURGE', label: 'SURGE', icon: MoveVertical, motion: { roll: 0, pitch: 0, yaw: 0, surge: -0.15, sway: 0, heave: 0 }, desc: 'Longitudinal displacement along vehicle longitudinal axis.' },
  { id: 'SWAY', label: 'SWAY', icon: MoveHorizontal, motion: { roll: 0, pitch: 0, yaw: 0, surge: 0, sway: 0.18, heave: 0 }, desc: 'Lateral translation along vehicle transverse axis.' },
  { id: 'HEAVE', label: 'HEAVE', icon: MoveVertical, motion: { roll: 0, pitch: 0, yaw: 0, surge: 0, sway: 0, heave: 0.12 }, desc: 'Vertical displacement representing road surface bumps and elevation shifts.' }
];

export default function InteractiveDOFSection({ motionState, setMotionState }) {
  const [activeDof, setActiveDof] = useState('RESET');

  const handleSelectDof = (dof) => {
    setActiveDof(dof.id);
    setMotionState(dof.motion);
  };

  const activeDofObj = DOF_MODES.find((d) => d.id === activeDof) || DOF_MODES[0];

  return (
    <section className="section-block section-white interactive-dof-section">
      <div className="section-header center-header">
        <span className="section-num font-mono text-ae-red">INTERACTIVE KINEMATICS</span>
        <h2 className="section-title">6-DOF MOTION PLATFORM</h2>
        <p className="section-desc">
          Select a degree of freedom below to visualize how the Stewart platform translates vehicle dynamic forces.
        </p>
        <div className="section-title-line" />
      </div>

      <div className="dof-controls-wrapper">
        <div className="dof-buttons-grid">
          {DOF_MODES.map((dof) => {
            const Icon = dof.icon;
            const isSelected = activeDof === dof.id;
            return (
              <button
                key={dof.id}
                type="button"
                className={`dof-control-btn ae-card ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelectDof(dof)}
              >
                <div className="dof-btn-header">
                  <Icon size={18} className={isSelected ? 'text-white' : 'text-ae-red'} />
                  <span className="dof-btn-title font-mono">{dof.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="dof-info-panel ae-card">
          <div className="info-header">
            <span className="font-mono text-xs text-ae-red">ACTIVE DYNAMIC DISPLACEMENT</span>
            <h3 className="font-heading">{activeDofObj.label}</h3>
          </div>
          <p className="info-desc">{activeDofObj.desc}</p>
          <div className="info-disclaimer font-mono">
            <span className="text-ae-red">*</span> NOTE: Visual representation of kinematic movement. Technical specifications provided per client build configuration.
          </div>
        </div>
      </div>
    </section>
  );
}
