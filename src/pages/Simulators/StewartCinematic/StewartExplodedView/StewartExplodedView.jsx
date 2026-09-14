import React from 'react';
import SixDofImageViewer from '../../../../components/three/SixDofImageViewer';
import './StewartExplodedView.css';

export default function StewartExplodedView() {
  return (
    <div className="stewart-exploded-view-container" style={{ padding: '60px 0', textAlign: 'center' }}>
      <h2 className="font-heading" style={{ fontSize: '2rem', marginBottom: '12px' }}>
        6-DOF Platform <span className="text-cyan-400">Kinematics</span>
      </h2>
      <p style={{ color: '#666', marginBottom: '24px' }}>
        Drag the explosion slider below to disassemble the mechanical 6-DOF kinematics assembly.
      </p>
      <div className="font-mono text-ae-red" style={{ marginBottom: '16px', fontWeight: 700 }}>
        AE 6-DOF HEXAPOD
      </div>
      <SixDofImageViewer height="500px" />
    </div>
  );
}
