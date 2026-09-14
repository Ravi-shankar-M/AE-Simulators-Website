import React, { Suspense, lazy } from 'react';
import './StewartCinematic.css';

const StewartCinematicCanvas = lazy(() => import('../../../components/three/StewartCinematicCanvas'));

export default function StewartCinematicSection({ navigate }) {
  const handleNavigate = (path, e) => {
    if (e) e.preventDefault();
    if (navigate) navigate(path);
  };

  return (
    <section className="stewart-cinematic-section" aria-label="6-DOF Platform Cinematic Experience" style={{ padding: '80px 0', background: '#FFFFFF' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="font-mono text-ae-red" style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.12em', display: 'block', marginBottom: '8px' }}>
            CINEMATIC SHOWCASE // 6-DOF KINEMATICS
          </span>
          <h2 className="font-heading" style={{ fontSize: '2.5rem', fontWeight: 800, color: '#17191C', marginBottom: '16px' }}>
            6-DOF Motion Platform Architecture
          </h2>
          <p className="font-body" style={{ color: '#555B63', maxWidth: '680px', margin: '0 auto', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Precision-engineered 6 Degrees of Freedom motion platform delivering true surge, sway, heave, roll, pitch, and yaw dynamics.
          </p>
        </div>

        <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)', background: '#F8FAFA', padding: '20px' }}>
          <Suspense fallback={<div className="stewart-cinematic-canvas-loader font-mono" style={{ padding: '40px', textAlign: 'center' }}>Loading 6-DOF Platform…</div>}>
            <StewartCinematicCanvas isVisible={true} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
