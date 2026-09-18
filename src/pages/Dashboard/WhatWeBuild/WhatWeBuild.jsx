import React from 'react';
import ScrollReveal from '../../../components/common/ScrollReveal';

import './WhatWeBuild.css';

import img3dof from './images/3dof-dashboard.webp';
import img3dofTablet from './images/3dof-dashboard-tablet.webp';
import img3dofMobile from './images/3dof-dashboard-mobile.webp';

import img6dof from './images/6doffer-dashboard.webp';
import img6dofTablet from './images/6doffer-dashboard-tablet.webp';
import img6dofMobile from './images/6doffer-dashboard-mobile.webp';

import imgSim from './images/simulation-dashboard.webp';
import imgSimTablet from './images/simulation-dashboard-tablet.webp';
import imgSimMobile from './images/simulation-dashboard-mobile.webp';

import imgAnalytics from './images/analytics-dashboard.webp';
import imgAnalyticsTablet from './images/analytics-dashboard-tablet.webp';
import imgAnalyticsMobile from './images/analytics-dashboard-mobile.webp';

import imgData from './images/dataacquisition-dashboard.webp';
import imgDataTablet from './images/dataacquisition-dashboard-tablet.webp';
import imgDataMobile from './images/dataacquisition-dashboard-mobile.webp';

import imgProduct from './images/product-dahboard.webp';
import imgProductTablet from './images/product-dahboard-tablet.webp';
import imgProductMobile from './images/product-dahboard-mobile.webp';

const WHAT_WE_BUILD_ROWS = [
  {
    num: '01',
    heading: '3-DOF Motion Platform',
    description: [
      'Compact platform for dynamic motion simulation.',
      'Delivers precise pitch, roll, and heave.',
      'Provides fast and realistic vehicle feedback.',
      'Ideal for immersive driving and testing.',
    ],
    image: img3dof,
    imageTablet: img3dofTablet,
    imageMobile: img3dofMobile,
    alt: '3-DOF Motion Platform Dashboard',
    link: '/3dof-motion-platform',
  },
  {
    num: '02',
    heading: '6-DOF Motion Platform',
    description: [
      'Advanced 6-DOF hexapod platform.',
      'Delivers precise six-axis motion control.',
      'Simulates pitch, roll, yaw, heave, surge & sway.',
      'Built for high-fidelity vehicle simulation.',
    ],
    image: img6dof,
    imageTablet: img6dofTablet,
    imageMobile: img6dofMobile,
    alt: '6-DOF Motion Platform Dashboard',
    link: '/6dof-motion-platform',
  },
  {
    num: '03',
    heading: 'Simulation Software',
    description: [
      'Real-time software for immersive simulation.',
      'Features realistic roads, traffic, and obstacles.',
      'Supports dynamic and interactive scenarios.',
      'Built for advanced driving simulation.',
    ],
    image: imgSim,
    imageTablet: imgSimTablet,
    imageMobile: imgSimMobile,
    alt: 'Simulation Software Platform Dashboard',
    link: '/software-platform',
  },
  {
    num: '04',
    heading: 'Performance Evaluation',
    description: [
      'Intelligent scoring for every training session.',
      'Tracks key performance metrics in real time.',
      'Provides detailed analytics and insights.',
      'Generates clear, actionable performance reports.',
    ],
    image: imgAnalytics,
    imageTablet: imgAnalyticsTablet,
    imageMobile: imgAnalyticsMobile,
    alt: 'Analytics & Evaluation Dashboard',
    link: '/simulators',
  },
  {
    num: '05',
    heading: 'Custom Products',
    description: [
      'Tailored simulator solutions for unique needs.',
      'Designed for specialized training and testing.',
      'Engineered to match specific requirements.',
      'Built for precise, reliable performance.',
    ],
    image: imgProduct,
    imageTablet: imgProductTablet,
    imageMobile: imgProductMobile,
    alt: 'Custom Products Dashboard',
    link: '/simulators',
  },
];

export default function WhatWeBuild({ navigate }) {
  const handleNavigate = (path, e) => {
    e.preventDefault();
    if (navigate) {
      navigate(path);
    }
  };

  return (
    <section
      className="what-we-build-editorial-section"
      id="what-we-build-section"
    >
      <div className="section-header center-header text-center mb-10">
        <span className="section-sublabel text-ae-red font-mono">
          WHAT WE BUILD
        </span>

        <h2 className="section-title">
          Engineering Realism. Delivering Performance.
        </h2>
      </div>

      <div className="what-build-container">
        {WHAT_WE_BUILD_ROWS.map((row, index) => {
          const isEven = index % 2 === 0;
          return (
            <article
              key={index}
              className={`what-build-row ${isEven ? 'image-left' : 'content-left'}`}
            >
              {/* Engineering Corner Accents */}
              <span className="panel-corner corner-tl" />
              <span className="panel-corner corner-tr" />
              <span className="panel-corner corner-bl" />
              <span className="panel-corner corner-br" />

              {isEven ? (
                <>
                  <div className="what-build-image">
                    <ScrollReveal variant="fade-up" delay={0.1}>
                      <div className="what-build-img-wrapper">
                        <span className="img-corner img-tl" />
                        <span className="img-corner img-tr" />
                        <span className="img-corner img-bl" />
                        <span className="img-corner img-br" />
                        <button
                          type="button"
                          className="what-build-img-box"
                          onClick={(e) => handleNavigate(row.link, e)}
                        >
                          <picture>
                            <source media="(max-width: 767px)" srcSet={row.imageMobile} />
                            <source media="(max-width: 1024px)" srcSet={row.imageTablet} />
                            <img
                              src={row.image}
                              alt={row.alt}
                              className="what-build-img"
                              loading="lazy"
                            />
                          </picture>
                        </button>
                      </div>
                    </ScrollReveal>
                  </div>

                  <div className="what-build-content">
                    <ScrollReveal variant="fade-up" delay={0.2}>
                      <div className="what-build-header-wrap">
                        <span className="what-build-large-num font-mono">{row.num}</span>
                        <h3 className="what-build-heading font-heading">
                          {row.heading}
                        </h3>
                      </div>

                      <div className="what-build-divider" />

                      <div className="what-build-desc font-body">
                        {row.description.map((line, lIdx) => (
                          <span key={lIdx} className="what-build-desc-line">
                            <span className="desc-bullet-orange">•</span> {line}
                          </span>
                        ))}
                      </div>
                    </ScrollReveal>
                  </div>
                </>
              ) : (
                <>
                  <div className="what-build-content">
                    <ScrollReveal variant="fade-up" delay={0.1}>
                      <div className="what-build-header-wrap">
                        <span className="what-build-large-num font-mono">{row.num}</span>
                        <h3 className="what-build-heading font-heading">
                          {row.heading}
                        </h3>
                      </div>

                      <div className="what-build-divider" />

                      <div className="what-build-desc font-body">
                        {row.description.map((line, lIdx) => (
                          <span key={lIdx} className="what-build-desc-line">
                            <span className="desc-bullet-orange">•</span> {line}
                          </span>
                        ))}
                      </div>
                    </ScrollReveal>
                  </div>

                  <div className="what-build-image">
                    <ScrollReveal variant="fade-up" delay={0.2}>
                      <div className="what-build-img-wrapper">
                        <span className="img-corner img-tl" />
                        <span className="img-corner img-tr" />
                        <span className="img-corner img-bl" />
                        <span className="img-corner img-br" />
                        <button
                          type="button"
                          className="what-build-img-box"
                          onClick={(e) => handleNavigate(row.link, e)}
                        >
                          <picture>
                            <source media="(max-width: 767px)" srcSet={row.imageMobile} />
                            <source media="(max-width: 1024px)" srcSet={row.imageTablet} />
                            <img
                              src={row.image}
                              alt={row.alt}
                              className="what-build-img"
                              loading="lazy"
                            />
                          </picture>
                        </button>
                      </div>
                    </ScrollReveal>
                  </div>
                </>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}


