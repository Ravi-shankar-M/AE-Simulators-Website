import React, { useState, useEffect, useRef } from 'react';
import { ASSETS } from '../../../data/assets';
import './VectorLoaderStage.css';

export default function VectorLoaderStage({ onFinished }) {
  const [progress, setProgress] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const onFinishedRef = useRef(onFinished);

  useEffect(() => {
    onFinishedRef.current = onFinished;
  }, [onFinished]);

  // Smooth Loading Progress (0% to 100% over 3.8s)
  useEffect(() => {
    const startTime = Date.now();
    const duration = 3800;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => setIsExpanded(true), 250);
        setTimeout(() => {
          if (onFinishedRef.current) {
            onFinishedRef.current();
          }
        }, 750);
      }
    }, 28);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleSkip = (e) => {
    if (e) e.stopPropagation();
    if (onFinishedRef.current) {
      onFinishedRef.current();
    }
  };

  // Clicking anywhere on the screen immediately enters the site!
  const handleStageClick = () => {
    handleSkip();
  };

  return (
    <div
      className={`vector-loader-wrapper classic-minimal-loader ${isExpanded ? 'expanded' : ''}`}
      onClick={handleStageClick}
      title="Click anywhere to enter site"
    >
      {/* DARK PITCH BLACK BACKDROP WITH AMBIENT LASER SPOTLIGHT */}
      <div className="minimal-dark-backdrop">
        <div className="ambient-laser-glow" />
      </div>

      {/* FLASH SHOCKWAVE ON 100% */}
      {progress >= 95 && <div className="warp-flash-shockwave" />}

      {/* TOP CONTROL ACTION BAR (SKIP ONLY - AUDIO REMOVED) */}
      <div className="top-action-bar">
        <button className="vector-skip-button" onClick={handleSkip} title="Click to Skip Intro">
          ENTER SITE &#2192;
        </button>
      </div>

      {/* CLASSIC PREMIUM MINIMAL LOGO CONTAINER */}
      <div className="classic-minimal-container">
        {/* PROMINENT HIGH-VISIBILITY AE BRAND LOGO */}
        <div className="minimal-logo-wrapper">
          <img
            src={ASSETS.logo.official}
            alt="AE Simulators Official Logo"
            className="minimal-brand-logo"
          />
        </div>

        {/* BUSINESS TITLE & SUBTITLE */}
        <h1 className="minimal-brand-title">AE SIMULATORS</h1>
        <p className="minimal-brand-sub">ADVANCED AUTOMOTIVE SIMULATION SYSTEMS</p>

        {/* ELEGANT M-SPORT TRICOLOR ACCENT LINE */}
        <div className="minimal-tricolor-line">
          <span className="stripe-blue" />
          <span className="stripe-navy" />
          <span className="stripe-red" />
        </div>

        {/* MINIMAL SPEEDOMETER LOADER LINE WITH SMALL NEEDLE PIN */}
        <div className="minimal-progress-box">
          <div className="line-speedo-header">
            <span className="speedo-tick">0</span>
            <span className="speedo-tick">50</span>
            <span className="speedo-tick redline">100</span>
          </div>

          <div className="minimal-track-bar">
            <div
              className="minimal-fill-bar"
              style={{ width: `${progress}%` }}
            />

            {/* SMALL SPEEDOMETER NEEDLE PIN GLIDING ALONG THE LINE */}
            <div
              className="linear-needle-pin"
              style={{ left: `${Math.min(99, progress)}%` }}
            >
              <div className="needle-head-glow" />
              <div className="needle-pin-body" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
