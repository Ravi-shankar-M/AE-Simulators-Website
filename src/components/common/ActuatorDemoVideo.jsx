import React from 'react';
import './ActuatorDemoVideo.css';
import ThreeDofImageViewer from '../three/ThreeDofImageViewer';
import SixDofImageViewer from '../three/SixDofImageViewer';

export default function ActuatorDemoVideo({ type = '3DOF', height = '100%' }) {
  return (
    <div className="actuator-demo-container" style={{ height }}>
      {type === '3DOF' ? (
        <ThreeDofImageViewer height="100%" demoMode={true} />
      ) : (
        <SixDofImageViewer height="100%" demoMode={true} />
      )}
    </div>
  );
}
