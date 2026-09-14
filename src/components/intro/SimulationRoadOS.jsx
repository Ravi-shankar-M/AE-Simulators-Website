import React from 'react';

export default function SimulationRoadOS({ activeRoad, activeHUD }) {
  return (
    <>
      {/* Simulated Road Lanes */}
      <div className={`simulation-road-layer ${activeRoad ? 'active' : ''}`}>
        <div className="road-lane-line" />
      </div>

      {/* Driver Analytics Telemetry HUD */}
      <div className={`telemetry-hud-overlay ${activeHUD ? 'active' : ''}`}>
        <div>DRIVER_SCORE: 96.4 // OPTIMAL</div>
        <div>STEERING_PRECISION: 94.8%</div>
        <div>BRAKING_MODULATION: 98.2%</div>
        <div>LANE_DISCIPLINE: 99.1%</div>
        <div>RESPONSE_TIME: 0.24s</div>
      </div>
    </>
  );
}
