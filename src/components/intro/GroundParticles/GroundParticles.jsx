import React from 'react';

export default function GroundParticles() {
  return (
    <div className="ground-friction-emitter">
      {/* Orange & Red Friction Dust Cloud */}
      <div className="friction-dust-cloud" />
      <div className="friction-dust-cloud" style={{ animationDelay: '0.18s' }} />

      {/* Bright Orange / Red Sparks */}
      <div className="friction-spark-bright" style={{ left: '0px' }} />
      <div className="friction-spark-bright" style={{ left: '35px', animationDelay: '0.12s' }} />
      <div className="friction-spark-bright" style={{ left: '70px', animationDelay: '0.24s' }} />
      <div className="friction-spark-bright" style={{ left: '105px', animationDelay: '0.18s' }} />
    </div>
  );
}
