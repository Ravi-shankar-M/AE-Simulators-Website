import React, { useState } from 'react';
import { activeDemos, mergedDemos } from './demoRegistry';
import { Beaker, CheckCircle2, Play, ArrowLeft, PlusCircle, Layers, Sparkles } from 'lucide-react';
import '../components/DemoStaging.css';

export default function DemoStagingPage({ navigate }) {
  const [selectedDemoId, setSelectedDemoId] = useState(
    activeDemos.length > 0 ? activeDemos[0].id : null
  );

  const currentDemo = activeDemos.find((d) => d.id === selectedDemoId);

  return (
    <div className="demo-staging-container">
      {/* Top Banner Header */}
      <div className="demo-staging-hero">
        <div className="demo-hero-badge font-mono">
          <Beaker size={16} className="text-ae-red" />
          <span>DEMO STAGING LAB & APPROVAL CENTER</span>
        </div>
        <h1 className="demo-hero-title font-heading">
          Feature Demos & Preview Environment
        </h1>
        <p className="demo-hero-desc">
          Every new requirement or feature requested will be deployed here as an isolated interactive demo first. Once tested and accepted by you, it is instantly merged into the Main AE-Simulators Website.
        </p>

        <button className="ae-btn ae-btn-secondary" onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> Return to Main Website
        </button>
      </div>

      <div className="demo-staging-layout">
        {/* Sidebar Demo Selection */}
        <aside className="demo-sidebar">
          <h3 className="demo-sidebar-title font-heading">
            <Layers size={18} /> Active Demos ({activeDemos.length})
          </h3>

          {activeDemos.length === 0 ? (
            <div className="demo-empty-card">
              <Sparkles size={24} className="text-ae-red mb-2" />
              <p className="font-heading" style={{ fontSize: '0.95rem' }}>No Pending Demos</p>
              <p style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.25rem' }}>
                Main website baseline is fully active. Give any new prompt/input to create your next demo!
              </p>
            </div>
          ) : (
            <div className="demo-list">
              {activeDemos.map((demo) => (
                <div
                  key={demo.id}
                  className={`demo-item-card ${selectedDemoId === demo.id ? 'active' : ''}`}
                  onClick={() => setSelectedDemoId(demo.id)}
                >
                  <div className="demo-item-badge">
                    <span className="demo-status-pill pending">Pending Review</span>
                    <span className="demo-category">{demo.category}</span>
                  </div>
                  <h4 className="demo-item-title font-heading">{demo.title}</h4>
                  <p className="demo-item-desc">{demo.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Merged Demos History */}
          {mergedDemos.length > 0 && (
            <div className="merged-demos-section mt-6">
              <h4 className="demo-sidebar-title font-heading" style={{ fontSize: '0.9rem' }}>
                <CheckCircle2 size={16} className="text-emerald-400" /> Merged Demos ({mergedDemos.length})
              </h4>
              <div className="merged-list">
                {mergedDemos.map((m) => (
                  <div key={m.id} className="merged-item font-mono">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    <span>{m.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Main Preview Screen */}
        <main className="demo-viewport-container">
          {currentDemo ? (
            <div className="demo-viewport-card">
              <div className="demo-viewport-header">
                <div>
                  <span className="font-mono text-ae-red" style={{ fontSize: '0.75rem' }}>
                    DEMO PREVIEW MODE
                  </span>
                  <h2 className="demo-viewport-title font-heading">{currentDemo.title}</h2>
                </div>
                <div className="demo-viewport-actions">
                  <div className="demo-status-tag">
                    <Play size={14} /> Interactive Live Staging
                  </div>
                </div>
              </div>

              <div className="demo-canvas-area">
                {currentDemo.component ? (
                  <currentDemo.component navigate={navigate} />
                ) : (
                  <div className="p-8 text-center">Demo Component Ready</div>
                )}
              </div>
            </div>
          ) : (
            <div className="demo-placeholder-viewport">
              <Beaker size={48} className="text-ae-red mb-4 opacity-50" />
              <h3 className="font-heading text-xl">Main Website Is Up to Date</h3>
              <p className="max-w-md text-center mt-2 opacity-75" style={{ fontSize: '0.9rem' }}>
                You are currently running the main finished baseline version of AE-Simulators.
                Whenever you share your next demo idea, it will appear right here for your inspection and one-click acceptance!
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
