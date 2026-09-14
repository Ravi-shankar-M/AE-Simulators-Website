import React, { useRef, useState, useEffect } from 'react';
import StagedActuatorCanvas from '../../../../components/three/StagedActuatorCanvas';
import { ArrowRight } from 'lucide-react';
import './StagedActuatorSection.css';

export default function StagedActuatorSection({ navigate }) {
  const trackRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!trackRef.current) return;

      const rect = trackRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress ratio (0.0 to 1.0) within the sticky scroll track
      const totalScrollableDistance = rect.height - windowHeight;
      if (totalScrollableDistance <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.min(Math.max(currentScroll / totalScrollableDistance, 0), 1);

      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine current active stage (1 to 4)
  let activeStage = 1;
  let stageHeadline = 'BASE STRUCTURE';
  let stageSubtext = 'Rear clevis & motor mounting block align.';
  let stageDigit = '01 / BASE STRUCTURE';

  if (scrollProgress >= 0.75) {
    activeStage = 4;
    stageDigit = '04 / COMPLETE ACTUATOR';
    stageHeadline = 'COMPLETE ACTUATOR';
    stageSubtext = 'Fully assembled. Ready for high-frequency motion.';
  } else if (scrollProgress >= 0.5) {
    activeStage = 3;
    stageDigit = '03 / HOUSING INTEGRATION';
    stageHeadline = 'HOUSING INTEGRATION';
    stageSubtext = 'Outer protective cylinder closes around core mechanism.';
  } else if (scrollProgress >= 0.25) {
    activeStage = 2;
    stageDigit = '02 / DRIVE MECHANISM';
    stageHeadline = 'DRIVE MECHANISM';
    stageSubtext = 'Precision ball screw & thrust bearings engage.';
  }

  const handleExploreClick = () => {
    if (navigate) {
      navigate('/6dof-motion-platform');
    }
  };

  return (
    <section className="staged-actuator-section" ref={trackRef}>
      <div className="staged-actuator-track">
        <div className="staged-actuator-viewport">
          {/* Top Header */}
          <div className="staged-header">
            <div className="staged-brand-tag font-mono">
              <span>ACTUATOR KINEMATICS</span>
            </div>

            {/* Minimal Stage Content Box */}
            <div className="staged-content-box">
              <div className="staged-digit font-mono">{stageDigit}</div>
              <h2 className="staged-headline font-heading">{stageHeadline}</h2>
              <p className="staged-subtext font-body">{stageSubtext}</p>
            </div>
          </div>

          {/* 3D Canvas Layer */}
          <StagedActuatorCanvas
            scrollProgress={scrollProgress}
            onClickActuator={handleExploreClick}
          />

          {/* Bottom Progress & Action Bar */}
          <div className="staged-bottom-bar">
            <div className="staged-progress-indicator">
              <div className="staged-dots">
                <div className={`staged-dot ${activeStage === 1 ? 'active' : ''}`} />
                <div className={`staged-dot ${activeStage === 2 ? 'active' : ''}`} />
                <div className={`staged-dot ${activeStage === 3 ? 'active' : ''}`} />
                <div className={`staged-dot ${activeStage === 4 ? 'active' : ''}`} />
              </div>
              <span className="staged-progress-label font-mono">
                {activeStage === 4 ? '100% — ASSEMBLED' : `${Math.round(scrollProgress * 100)}% — SCROLL TO ASSEMBLE`}
              </span>
            </div>

            {/* Floating Interactive CTA Button in Stage 04 */}
            {activeStage === 4 && (
              <div className="staged-explore-cta" onClick={handleExploreClick}>
                <span>EXPLORE MOTION PLATFORMS</span>
                <ArrowRight size={16} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
