import React, { useState } from 'react';
import { Car, Database, Activity, Award, FileText, ChevronRight } from 'lucide-react';
import './DriverEvaluationWorkflow.css';

export default function DriverEvaluationWorkflow() {
  const [activeStep, setActiveStep] = useState(0);

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
    <div className="evaluation-workflow-wrapper">
      <div className="op-modules-header" style={{ marginBottom: '16px', padding: 0 }}>
        <span className="section-num font-mono text-ae-red">EVALUATION ENGINE WORKFLOW</span>
        <h2 className="section-title font-heading">DRIVER EVALUATION &amp; PERFORMANCE ENGINE</h2>
        <p className="section-desc font-body">
          Structured 5-step evaluation process tracking vehicle telemetry, driver inputs, and session analytics.
        </p>
      </div>

      {/* 5-STEP SEQUENTIAL PROCESS TRACK */}
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

      {/* ACTIVE STEP DISPLAY CARD */}
      <div className="workflow-detail-display font-mono">
        <div className="detail-top font-mono">
          <span className="detail-step-tag text-ae-red">STEP {steps[activeStep].num} — {steps[activeStep].title}</span>
          <span className="detail-sub">{steps[activeStep].subtitle}</span>
        </div>
        <p className="detail-desc font-body">{steps[activeStep].desc}</p>
      </div>
    </div>
  );
}
