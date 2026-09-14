import React, { useState, useEffect } from 'react';
import { useIntersectionObserver } from '../utils/useIntersectionObserver';

export default function PerformanceSection() {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.2 });

  const metrics = [
    { label: 'OVERALL DRIVING SCORE', baseVal: 96.4, unit: '/ 100', progress: '96%', isFloat: true },
    { label: 'BRAKING MODULATION', baseVal: 98.2, unit: 'Smooth', progress: '98%', isFloat: true },
    { label: 'STEERING PRECISION', baseVal: 94.8, unit: 'Accurate', progress: '95%', isFloat: true },
    { label: 'LANE CONTROL DISCIPLINE', baseVal: 99.1, unit: 'Optimal', progress: '99%', isFloat: true },
    { label: 'TRAFFIC RESPONSE TIME', baseVal: 0.24, unit: 'Reaction', progress: '92%', isFloat: true },
    { label: 'PARKING ACCURACY', baseVal: 97.5, unit: 'Centered', progress: '97%', isFloat: true },
    { label: 'COLLISION EVENTS', baseVal: 0, unit: 'Clean Drive', progress: '100%', isFloat: false },
    { label: 'TELEMETRY REFRESH RATE', baseVal: 1000, unit: 'Sensors', progress: '100%', isFloat: false },
  ];

  return (
    <section id="analytics" className="section-container" style={{ background: '#07090e' }} ref={ref}>
      <div className="section-header">
        <span className="section-headline-eyebrow">04 / INTELLIGENT ANALYTICS OS</span>
        <h2 className="section-headline">
          EVERY DRIVE <span>BECOMES DATA.</span>
        </h2>
        <p className="section-description">
          Measure driver performance with precision telemetry. Automated scoring dashboards provide immediate feedback for continuous skill improvement.
        </p>
      </div>

      <div className="telemetry-grid">
        {metrics.map((m, index) => (
          <TelemetryMetricCard key={index} metric={m} startAnim={isVisible} />
        ))}
      </div>
    </section>
  );
}

function TelemetryMetricCard({ metric, startAnim }) {
  const [currentVal, setCurrentVal] = useState(0);

  useEffect(() => {
    if (!startAnim) return;

    let start = 0;
    const duration = 1200; // ms
    const steps = 30;
    const increment = metric.baseVal / steps;
    const stepTime = duration / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= metric.baseVal) {
        setCurrentVal(metric.baseVal);
        clearInterval(timer);
      } else {
        setCurrentVal(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [startAnim, metric.baseVal]);

  const displayString = metric.isFloat
    ? currentVal.toFixed(1)
    : Math.round(currentVal).toLocaleString();

  return (
    <div className="telemetry-card">
      <div className="telemetry-metric-title">{metric.label}</div>
      <div className="telemetry-metric-value">
        {displayString} <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{metric.unit}</span>
      </div>
      <div className="telemetry-bar-outer">
        <div
          className="telemetry-bar-inner"
          style={{
            width: startAnim ? metric.progress : '0%',
            transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </div>
    </div>
  );
}
