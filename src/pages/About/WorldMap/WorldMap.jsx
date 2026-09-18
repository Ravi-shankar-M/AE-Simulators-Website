import React from 'react';
import ScrollReveal from '../../../components/common/ScrollReveal';

import './WorldMap.css';
import worldmapImg from './images/world-map-final.png';
import worldmapImgTablet from './images/world-map-final-tablet.png';
import worldmapImgMobile from './images/world-map-final-mobile.png';

export default function WorldMap() {
  return (
    <section className="about-worldmap-section">
      <ScrollReveal variant="fade-up">
        <div className="section-header center-header" style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <span className="section-sublabel font-mono" style={{ color: '#E31B23' }}>GLOBAL PRESENCE</span>
          <h2 className="section-title font-heading" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800 }}>
            WORLDWIDE FOOTPRINT &amp; DEPLOYMENTS
          </h2>
          <div className="section-title-line" style={{ margin: '0 auto' }} />
        </div>
        <div className="about-worldmap-wrapper">
          <picture>
            <source media="(max-width: 767px)" srcSet={worldmapImgMobile} />
            <source media="(max-width: 1024px)" srcSet={worldmapImgTablet} />
            <img
              src={worldmapImg}
              alt="AE Simulators Worldwide Footprint Map"
              className="about-worldmap-image"
              loading="lazy"
            />
          </picture>
        </div>
      </ScrollReveal>
    </section>
  );
}
