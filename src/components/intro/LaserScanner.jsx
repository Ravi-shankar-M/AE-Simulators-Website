import React from 'react';

export default function LaserScanner({ active, showCoordinates }) {
  return (
    <>
      {/* Red Laser Scanner Line */}
      <div className={`red-laser-scanner ${active ? 'active' : ''}`} />

      {/* Engineering HUD Coordinate Markers */}
      <div className={`hud-coordinates-group ${showCoordinates ? 'active' : ''}`}>
        <div className="hud-tick-text" style={{ top: '20px', left: '25px' }}>
          SYS.DIAG // 0x4F8A [ONLINE]
        </div>
        <div className="hud-tick-text" style={{ top: '20px', right: '25px' }}>
          LATENCY: 0.2ms // 1,000 Hz
        </div>
        <div className="hud-tick-text" style={{ bottom: '20px', left: '25px' }}>
          FRAME: CHASSIS_MONOCOQUE_01
        </div>
        <div className="hud-tick-text" style={{ bottom: '20px', right: '25px' }}>
          AE_ENGINEERING_OS v4.8
        </div>
      </div>
    </>
  );
}
