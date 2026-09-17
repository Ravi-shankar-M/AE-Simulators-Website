import React, { useState } from 'react';
import { ShieldCheck, MoveVertical, RotateCw, Compass } from 'lucide-react';
import InteractiveProductViewer from '../../components/common/InteractiveProductViewer';
import ProtectedImage from '../../components/common/ProtectedImage';
import SixDofImageViewer from '../../components/three/SixDofImageViewer';
import './MotionPlatformKinematics.css';

import threeDofDemoImg from './images/3dof-demo.webp';

const THREE_DOF_IMAGE = threeDofDemoImg;

/* ── 3-DOF MOTION STATES ── */
const STATES_3DOF = [
  { id: 'NEUTRAL', label: 'NEUTRAL', icon: ShieldCheck, transform: 'translate3d(0px, 0px, 0px) rotate(0deg)' },
  { id: 'PITCH', label: 'PITCH', icon: MoveVertical, transform: 'translate3d(0px, -12px, 0px) rotate(-6deg)' },
  { id: 'ROLL', label: 'ROLL', icon: RotateCw, transform: 'translate3d(8px, -4px, 0px) rotate(-8deg)' },
  { id: 'YAW', label: 'YAW', icon: Compass, transform: 'translate3d(-6px, 0px, 0px) rotate(7deg)' },
];

export default function MotionPlatformKinematics() {
  const [active3DOFState, setActive3DOFState] = useState('NEUTRAL');

  const current3DOF = STATES_3DOF.find((s) => s.id === active3DOFState) || STATES_3DOF[0];

  return (
    <div className="kinematics-master-container">
      {/* ── TWO-COLUMN REAL PRODUCT KINEMATICS ROW ── */}
      <div className="kinematics-demos-row">

        {/* COLUMN 1: REAL 3-DOF SIMULATOR KINEMATICS */}
        <div className="kin-panel ae-card">
          <div className="kin-panel-header font-mono">
            <span className="kin-panel-badge text-ae-red">3-DOF KINEMATICS</span>
            <h3 className="kin-panel-title font-heading">3-DOF MOTION PLATFORM</h3>
          </div>

          <div className="kin-stage">
            {/* REAL PHOTOGRAPH VISUAL WITH SEAMLESS BASE-ANCHORED COMPOSITING */}
            <div className="kin-img-stage-viewport">
              <div className="kin-img-base-layer">
                <ProtectedImage
                  src={THREE_DOF_IMAGE}
                  alt="3-DOF Motion Platform Base Anchor"
                  className="kin-real-product-img kin-3dof-img kin-base-img"
                />
              </div>
              <div
                className="kin-img-moving-layer"
                style={{
                  transform: current3DOF.transform,
                  transition: 'transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)',
                  transformOrigin: '50% 88%'
                }}
              >
                <ProtectedImage
                  src={THREE_DOF_IMAGE}
                  alt="3-DOF Motion Platform Simulator Visual"
                  className="kin-real-product-img kin-3dof-img kin-moving-img"
                />
              </div>
            </div>

            <div className="kin-state-overlay font-mono">
              <span className={`kin-state-dot ${active3DOFState === 'NEUTRAL' ? '' : 'active'}`} />
              <span className="kin-state-id">{active3DOFState}</span>
            </div>
            {/* MOTION BUTTONS ONLY — NO TEXT DESCRIPTIONS */}
            <div className="kin-controls font-mono">
              {STATES_3DOF.map((st) => {
                const IconComp = st.icon;
                const isSelected = active3DOFState === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    className={`kin-control-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => setActive3DOFState(st.id)}
                  >
                    <IconComp size={14} className="kin-btn-icon" />
                    <span>{st.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* COLUMN 2: REAL 6-DOF SIMULATOR KINEMATICS */}
        <div className="kin-panel ae-card">
          <div className="kin-panel-header font-mono">
            <span className="kin-panel-badge text-ae-red">6-DOF KINEMATICS</span>
            <h3 className="kin-panel-title font-heading">6-DOF MOTION PLATFORM</h3>
          </div>

          <SixDofImageViewer height="460px" />
        </div>

      </div>

      {/* ── DEDICATED REAL 3D GLB INTERACTIVE PRODUCT VIEWER ── */}
      <div className="kinematics-glb-section">
        <InteractiveProductViewer />
      </div>
    </div>
  );
}
