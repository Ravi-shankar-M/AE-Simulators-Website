import React from 'react';
import ProtectedImage from '../../../components/common/ProtectedImage';
import { ArrowRight } from 'lucide-react';
import './Products.css';

import gamingSimImg from './images/gaming simulator.png';
import gamingSimImgTablet from './images/gaming simulator-tablet.png';
import gamingSimImgMobile from './images/gaming simulator-mobile.png';
import trainingSimImg from './images/training simulator.png';
import trainingSimImgTablet from './images/training simulator-tablet.png';
import trainingSimImgMobile from './images/training simulator-mobile.png';

export default function Products({ navigate }) {
  const productsList = [
    {
      id: 'gaming',
      title: 'GAMING SIMULATORS',
      subtitle: 'HIGH-PERFORMANCE MOTION PLATFORMS & SIM RIGS',
      desc: 'Engineered for motorsport enthusiasts, sim racers, and commercial entertainment centers.',
      image: gamingSimImg,
      imageTablet: gamingSimImgTablet,
      imageMobile: gamingSimImgMobile,
      link: '/simulators/gaming',
    },
    {
      id: 'training',
      title: 'TRAINING SIMULATORS',
      subtitle: 'INSTITUTIONAL & DEFENSE DRIVER TRAINING PLATFORMS',
      desc: 'Institutional-grade driving simulators designed for research institutions, defense training facilities, automotive OEMs, and professional driving academies.',
      image: trainingSimImg,
      imageTablet: trainingSimImgTablet,
      imageMobile: trainingSimImgMobile,
      link: '/simulators/training',
    },
  ];

  const handleExploreClick = (link) => {
    if (navigate) {
      navigate(link);
    } else {
      window.location.href = link;
    }
  };

  return (
    <section id="about-products-showcase" className="about-products-section">
      <div className="about-products-container">
        <div className="about-products-header">
          <h2 className="section-title" style={{ color: '#0f172a', fontSize: '2.2rem', fontWeight: 800, marginTop: '8px', marginBottom: '12px' }}>
            STATE-OF-THE-ART <span style={{ color: '#E31B23' }}>SIMULATION ECOSYSTEMS</span>
          </h2>
          <p className="section-description" style={{ color: '#64748b', maxWidth: '720px', margin: '0 auto', fontSize: '1rem', lineHeight: 1.6 }}>
            Explore our advanced lineup of motion platforms engineered for high-octane gaming immersion and precision institutional driver training.
          </p>
        </div>

        <div className="about-products-grid">
          {productsList.map((product) => (
            <div key={product.id} className="about-product-card overlay-card">
              <div className="about-product-bg-image">
                <ProtectedImage
                  src={product.image}
                  srcTablet={product.imageTablet}
                  srcMobile={product.imageMobile}
                  alt={product.title}
                  className="about-product-img-bg"
                />
                <div className="about-product-gradient-overlay" />
              </div>
              <div className="about-product-overlay-content">
                <span className="about-product-subtitle font-mono" style={{ color: '#E31B23' }}>{product.subtitle}</span>
                <h3 className="about-product-title" style={{ color: '#E31B23' }}>{product.title}</h3>
                <p className="about-product-desc" style={{ color: '#ffffff' }}>{product.desc}</p>
                <button
                  onClick={() => handleExploreClick(product.link)}
                  className="about-product-btn"
                  aria-label={`Explore ${product.title}`}
                >
                  <span>EXPLORE PRODUCTS</span>
                  <ArrowRight size={18} className="btn-icon" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

