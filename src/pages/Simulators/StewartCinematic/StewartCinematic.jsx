import React from 'react';
import StewartCinematicSection from './StewartCinematicSection';
import { ArrowRight } from 'lucide-react';

export default function StewartCinematicPage({ navigate }) {
  const handleNavigate = (path, e) => {
    if (e) e.preventDefault();
    if (navigate) navigate(path);
  };

  return (
    <div
      className="stewart-cinematic-page-container"
      style={{ minHeight: '100vh', width: '100%', display: 'block', overflow: 'visible', position: 'relative', backgroundColor: '#ffffff' }}
    >
      {/* Top Cinematic Experience Section */}
      <StewartCinematicSection navigate={navigate} />

      {/* Final CTA Section - below the cinematic experience */}
      <section className="section-block section-light-grey contact-cta-section" style={{ marginTop: '80px', paddingTop: '80px', paddingBottom: '80px' }}>
        <div className="cta-box ae-card" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div className="cta-text">
            <span className="section-num font-mono text-ae-red">CINEMATIC EXPERIENCE COMPLETE</span>
            <h2 style={{ marginTop: '1rem', marginBottom: '1rem' }}>EXPLORE THE 6-DOF PLATFORM</h2>
            <p className="section-desc" style={{ maxWidth: '600px', margin: '0 auto' }}>
              Discover detailed specifications, kinematics architecture, and engineering data for the AE-SIMULATORS 6-DOF Hexapod Motion Platform.
            </p>
          </div>
          <div className="cta-action" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
            <a
              href="/6dof-motion-platform"
              className="btn-primary"
              onClick={(e) => handleNavigate('/6dof-motion-platform', e)}
            >
              VIEW 6-DOF PLATFORM <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
