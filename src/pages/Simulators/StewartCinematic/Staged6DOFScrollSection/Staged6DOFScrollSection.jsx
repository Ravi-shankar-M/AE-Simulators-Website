import React from 'react';
import SixDofImageViewer from '../../../../components/three/SixDofImageViewer';
import './Staged6DOFScrollSection.css';

export default function Staged6DOFScrollSection() {
  return (
    <section className="staged-6dof-wrapper" style={{ padding: '60px 0' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <h2 className="section-title">6-DOF MOTION PLATFORM KINEMATICS</h2>
        <p className="section-desc" style={{ marginBottom: '30px' }}>
          Interactive 3D assembly showcase of the AE-Simulators 6-DOF Hexapod Motion Platform.
        </p>
        <SixDofImageViewer height="540px" alt="6-DOF Hexapod Motion Platform" />
      </div>
    </section>
  );
}
