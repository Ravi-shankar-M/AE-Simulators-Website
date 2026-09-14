import React, { useState, useEffect } from 'react';
import { ASSETS } from '../data/assets';

export default function IntroGate({ onFinished }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 0.5s: logo begins appearing
    const revealTimer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    // 5.0s: homepage transition
    const finishTimer = setTimeout(() => {
      onFinished();
    }, 5000);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinished]);

  return (
    <div className="intro-gate-container">
      {/* Dark Cinematic Environment Background */}
      <div className="intro-gate-atmosphere" />
      <div className="intro-gate-horizon" />

      {/* Cinematic Logo Box (Occupies 70–80% Viewport Width) */}
      <div
        className="intro-logo-box"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(0.94)',
        }}
      >
        <div className="intro-logo-glass" />
        
        {/* Official Brand Logo (Occupies 55–65% Viewport Width) */}
        <img
          src={ASSETS.logo.official}
          alt="AE Simulators Official Logo"
          className="intro-logo-img"
        />

        {/* Soft Red Floor Reflection */}
        <div className="intro-logo-reflection" />
      </div>
    </div>
  );
}
