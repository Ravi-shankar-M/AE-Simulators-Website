import React, { useState, useEffect } from 'react';
import { Car, Database, Activity, Award, FileText, ChevronRight } from 'lucide-react';
import { useIntersectionObserver } from '../../../utils/useIntersectionObserver';

import './Performance.css';
import simulatorCockpitImg from './images/simulator_cockpit.webp';

export default function Performance() {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.2 });
  const [activeStep, setActiveStep] = useState(0);

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

  const steps = [
    {
      num: '01',
      title: 'DRIVE',
      subtitle: 'Driver Execution & Hazard Interaction',
      icon: Car,
      desc: 'Driver operates the physical simulator rig through defined road scenarios, traffic signals, turning maneuvers, and emergency hazard events.'
    },
    {
      num: '02',
      title: 'RECORD',
      subtitle: 'High-Frequency Sensor Data Acquisition',
      icon: Database,
      desc: 'Synchronous logging of vehicle telemetry including speed vectors, pedal displacement, steering lock angles, lane deviation, and brake force.'
    },
    {
      num: '03',
      title: 'ANALYSE',
      subtitle: 'Automated Event & Violation Detection',
      icon: Activity,
      desc: 'Evaluation algorithm continuously cross-references driver inputs against road compliance rules, speed limits, amber light dilemmas, and clearance distances.'
    },
    {
      num: '04',
      title: 'SCORE',
      subtitle: 'Intelligent Driver Performance Matrix',
      desc: 'Scores overall driving behavior on a 0–100 rating based on safety adherence, input smoothness, lane discipline, and emergency reaction times.',
      icon: Award
    },
    {
      num: '05',
      title: 'REPORT',
      subtitle: 'Comprehensive PDF Session Archiving',
      icon: FileText,
      desc: 'Generates structured evaluation reports complete with graph plots, traffic infraction logs, instructor notes, and session replay benchmarks.'
    }
  ];

  return (
    <section id="analytics" className="performance-section" ref={ref}>
      <div className="performance-container">
        <div className="section-header">
          <span className="section-sublabel">04 / INTELLIGENT ANALYTICS OS</span>
          <h2 className="section-title text-white" style={{ color: '#ffffff' }}>
            EVERY DRIVE <span style={{ color: '#E31B23' }}>BECOMES DATA.</span>
          </h2>
          <p className="section-desc" style={{ color: '#94a3b8' }}>
            Measure driver performance with precision telemetry. Automated scoring dashboards provide immediate feedback for continuous skill improvement.
          </p>
        </div>

        <div className="telemetry-grid">
          {metrics.map((m, index) => (
            <TelemetryMetricCard key={index} metric={m} startAnim={isVisible} />
          ))}
        </div>

        {/* WORKFLOW TRACK */}
        <div className="evaluation-workflow-wrapper">
          <div className="workflow-header font-mono">
            <div className="tech-badge" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
              <span className="badge-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#E31B23' }} />
              EVALUATION ENGINE WORKFLOW
            </div>
            <span className="demo-data-badge">[DEMO DATA — SIMULATION VISUALIZATION]</span>
          </div>

          <div className="workflow-steps-track">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <React.Fragment key={idx}>
                  <div
                    className={`workflow-step-node ${activeStep === idx ? 'active' : ''}`}
                    onClick={() => setActiveStep(idx)}
                  >
                    <div className="step-circle font-mono">
                      <StepIcon size={18} />
                    </div>
                    <span className="step-label font-heading">{step.title}</span>
                    <span className="step-num font-mono">{step.num}</span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="workflow-step-connector">
                      <div className={`connector-line ${activeStep > idx ? 'filled' : ''}`} />
                      <ChevronRight size={14} className="connector-arrow text-dim" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div className="workflow-detail-display font-mono">
            <div className="detail-top font-mono">
              <span className="detail-step-tag">STEP {steps[activeStep].num} — {steps[activeStep].title}</span>
              <span className="detail-sub">{steps[activeStep].subtitle}</span>
            </div>
            <p className="detail-desc font-body">{steps[activeStep].desc}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function TelemetryMetricCard({ metric, startAnim }) {
  const [currentVal, setCurrentVal] = useState(0);

  useEffect(() => {
    if (!startAnim) return;

    let start = 0;
    const duration = 1200;
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
