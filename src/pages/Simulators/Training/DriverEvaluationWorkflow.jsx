import React, { useState, useEffect, useRef } from 'react';
import { Car, Database, Activity, Award, FileText } from 'lucide-react';
import './DriverEvaluationWorkflow.css';

const STEPS = [
  { num: '01', title: 'DRIVE', subtitle: 'Driver Execution & Hazard Interaction', icon: Car, desc: 'Driver operates the physical simulator rig through defined road scenarios, traffic signals, turning maneuvers, and emergency hazard events.' },
  { num: '02', title: 'RECORD', subtitle: 'High-Frequency Sensor Data Acquisition', icon: Database, desc: 'Synchronous logging of vehicle telemetry including speed vectors, pedal displacement, steering lock angles, lane deviation, and brake force.' },
  { num: '03', title: 'ANALYSE', subtitle: 'Automated Event & Violation Detection', icon: Activity, desc: 'Evaluation algorithm continuously cross-references driver inputs against road compliance rules, speed limits, amber light dilemmas, and clearance distances.' },
  { num: '04', title: 'SCORE', subtitle: 'Intelligent Driver Performance Matrix', icon: Award, desc: 'Scores overall driving behavior on a 0–100 rating based on safety adherence, input smoothness, lane discipline, and emergency reaction times.' },
  { num: '05', title: 'REPORT', subtitle: 'Comprehensive PDF Session Archiving', icon: FileText, desc: 'Generates structured evaluation reports complete with graph plots, traffic infraction logs, instructor notes, and session replay benchmarks.' }
];

export default function DriverEvaluationWorkflow() {
  const [activeStep, setActiveStep] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.3 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;
    
    // Auto-advance logic
    let timer;
    if (activeStep < STEPS.length - 1) {
      timer = setTimeout(() => {
        setActiveStep(prev => prev + 1);
      }, 3500); // 3.5 seconds per stage
    }
    return () => clearTimeout(timer);
  }, [isInView, activeStep]);

  // Stage Visualizations
  const renderDriveVisual = () => (
    <div className="telemetry-visual drive-stage">
      <div className="t-row"><span className="t-label">SPEED</span><span className="t-val anim-val speed-anim">82 km/h</span></div>
      <div className="t-row"><span className="t-label">STEERING</span><span className="t-val anim-val steer-anim">12°</span></div>
      <div className="t-row"><span className="t-label">BRAKE</span><span className="t-val anim-val brake-anim">34%</span></div>
      <div className="t-row"><span className="t-label">THROTTLE</span><span className="t-val anim-val throttle-anim">61%</span></div>
      <div className="t-waveform">
        <div className="t-bar anim-bar-1"></div>
        <div className="t-bar anim-bar-2"></div>
        <div className="t-bar anim-bar-3"></div>
        <div className="t-bar anim-bar-4"></div>
        <div className="t-bar anim-bar-1"></div>
      </div>
    </div>
  );

  const renderRecordVisual = () => (
    <div className="telemetry-visual record-stage">
      <div className="r-row">
        <span className="r-label">RPM</span>
        <div className="r-track"><div className="r-fill anim-fill" style={{ width: '80%', animationDelay: '0s' }}></div></div>
      </div>
      <div className="r-row">
        <span className="r-label">SPEED</span>
        <div className="r-track"><div className="r-fill anim-fill" style={{ width: '60%', animationDelay: '0.1s' }}></div></div>
      </div>
      <div className="r-row">
        <span className="r-label">BRAKE</span>
        <div className="r-track"><div className="r-fill anim-fill" style={{ width: '30%', animationDelay: '0.2s' }}></div></div>
      </div>
      <div className="r-row">
        <span className="r-label">STEERING</span>
        <div className="r-track"><div className="r-fill anim-fill" style={{ width: '45%', animationDelay: '0.3s' }}></div></div>
      </div>
    </div>
  );

  const renderAnalyseVisual = () => (
    <div className="telemetry-visual analyse-stage">
      <div className="graph-container">
        <svg viewBox="0 0 400 100" className="analyse-graph" preserveAspectRatio="none">
          <path className="graph-grid" d="M 0,25 L 400,25 M 0,50 L 400,50 M 0,75 L 400,75" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
          <path className="graph-path" d="M 0,80 Q 50,80 75,40 T 150,20 T 220,60 T 300,10 T 400,50" fill="none" stroke="#E31B23" strokeWidth="2.5" />
        </svg>
        <div className="scanning-line"></div>
      </div>
      <div className="analysis-tags">
        <span className="a-tag blink">PATTERN DETECTED</span>
        <span className="a-tag">LATENCY: 12ms</span>
      </div>
    </div>
  );

  const renderScoreVisual = () => (
    <div className="telemetry-visual score-stage">
      <div className="score-main">
        <div className="score-number count-up">87.4</div>
        <div className="score-label">DRIVER PERFORMANCE</div>
      </div>
      <div className="score-metrics">
        <div className="s-metric"><span className="s-ml">CONTROL</span><div className="s-bar"><div className="s-fill" style={{width: '91%'}}></div></div><span className="s-mv">91</span></div>
        <div className="s-metric"><span className="s-ml">REACTION</span><div className="s-bar"><div className="s-fill" style={{width: '86%'}}></div></div><span className="s-mv">86</span></div>
        <div className="s-metric"><span className="s-ml">BRAKING</span><div className="s-bar"><div className="s-fill" style={{width: '89%'}}></div></div><span className="s-mv">89</span></div>
        <div className="s-metric"><span className="s-ml">HAZARD</span><div className="s-bar"><div className="s-fill" style={{width: '83%'}}></div></div><span className="s-mv">83</span></div>
      </div>
    </div>
  );

  const renderReportVisual = () => (
    <div className="telemetry-visual report-stage">
      <div className="doc-header">
        <span className="d-title">DRIVER EVALUATION REPORT</span>
        <span className="d-status text-ae-red">COMPLETED</span>
      </div>
      <div className="doc-line"></div>
      <div className="doc-body">
        <div className="d-row"><span>Performance Score</span><span className="d-val">87.4</span></div>
        <div className="d-row"><span>Safety Compliance</span><span className="d-val">91.2</span></div>
        <div className="d-row"><span>Vehicle Control</span><span className="d-val">89.7</span></div>
        <div className="d-row"><span>Reaction Time</span><span className="d-val">84.6</span></div>
      </div>
      <div className="doc-footer">
        <span>SESSION ARCHIVED</span>
      </div>
    </div>
  );

  const getVisual = (idx) => {
    switch (idx) {
      case 0: return renderDriveVisual();
      case 1: return renderRecordVisual();
      case 2: return renderAnalyseVisual();
      case 3: return renderScoreVisual();
      case 4: return renderReportVisual();
      default: return null;
    }
  };

  return (
    <div className="evaluation-workflow-wrapper" ref={containerRef}>
      <div className="op-modules-header" style={{ marginBottom: '24px', padding: 0 }}>
        <span className="section-num font-mono text-ae-red">EVALUATION ENGINE WORKFLOW</span>
        <h2 className="section-title font-heading">DRIVER EVALUATION &amp; PERFORMANCE ENGINE</h2>
        <p className="section-desc font-body">
          Structured 5-step evaluation process tracking vehicle telemetry, driver inputs, and session analytics.
        </p>
      </div>

      <div className="pipeline-container">
        {/* TOP: TRACK & NODES */}
        <div className="pipeline-track-wrapper">
          <div className="pipeline-track" style={{ '--progress': `${(activeStep / (STEPS.length - 1)) * 100}%` }}>
            <div className="track-line-bg"></div>
            {/* Active red track line filling up to current step */}
            <div className="track-line-fill"></div>
            {/* The travelling data pulse */}
            <div className="data-pulse"></div>

            <div className="pipeline-nodes">
              {STEPS.map((step, idx) => {
                const StepIcon = step.icon;
                const isPast = idx < activeStep;
                const isActive = idx === activeStep;
                return (
                  <div 
                    key={idx} 
                    className={`pipeline-node ${isActive ? 'active' : ''} ${isPast ? 'past' : ''}`}
                    onClick={() => setActiveStep(idx)}
                  >
                    <div className="p-node-circle">
                      <StepIcon size={16} />
                    </div>
                    <div className="p-node-info">
                      <span className="p-node-num font-mono">{step.num}</span>
                      <span className="p-node-title font-heading">{step.title}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* BOTTOM: ACTIVE STAGE CONTENT & VISUALIZATION */}
        <div className="pipeline-content-area">
          <div className="pipeline-text-block">
            <span className="detail-step-tag font-mono text-ae-red">STEP {STEPS[activeStep].num} — {STEPS[activeStep].title}</span>
            <h3 className="detail-sub font-heading">{STEPS[activeStep].subtitle}</h3>
            <p className="detail-desc font-body">{STEPS[activeStep].desc}</p>
          </div>
          <div className="pipeline-visual-block font-mono">
            {/* Adding a key forces re-mount of animations on step change */}
            <div className="visual-wrapper" key={activeStep}>
              {getVisual(activeStep)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
