import React from 'react';

export default function TireSmoke({ intensity = 'heavy' }) {
  return (
    <div className="tyre-smoke-emitter">
      <div className={`tyre-smoke-puff ${intensity}`} />
      <div className={`tyre-smoke-puff ${intensity}`} style={{ animationDelay: '0.15s' }} />
      <div className={`tyre-smoke-puff ${intensity}`} style={{ animationDelay: '0.3s' }} />
    </div>
  );
}
