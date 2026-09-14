import React from 'react';
import { CONTACT_CONFIG } from '../../config/contact';
import { MapPin, Mail } from 'lucide-react';

import './Footer.css';
import aesimLogoTransparent from './images/aesim-logo-transparent.png';
import makeInIndiaDark from './images/make-in-india-darkmode.png';

export default function Footer({ navigate }) {
  const handleNavClick = (path, e) => {
    if (e) e.preventDefault();
    if (navigate) navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="ae-footer">
      <div className="footer-container">
        {/* TOP BRAND STRIP — LOGO BLOCK */}
        <div className="footer-brand-block">
          <a href="/" onClick={(e) => handleNavClick('/', e)} className="footer-logo-link aesim-logo-link">
            <img
              src={aesimLogoTransparent}
              alt="AE Simulators Official Logo"
              className="footer-brand-logo"
            />
          </a>
        </div>

        {/* NAVIGATION COLUMN */}
        <div className="footer-links-column">
          <span className="column-title font-mono">NAVIGATION</span>
          <a href="/" onClick={(e) => handleNavClick('/', e)}>Dashboard</a>
          <a href="/about" onClick={(e) => handleNavClick('/about', e)}>About Us</a>
          <a href="/products" onClick={(e) => handleNavClick('/products', e)}>Simulators</a>
          <a href="/contact" onClick={(e) => handleNavClick('/contact', e)}>Contact Us</a>
        </div>

        {/* SIMULATORS COLUMN */}
        <div className="footer-links-column">
          <span className="column-title font-mono">SIMULATORS</span>
          <a href="/solutions" onClick={(e) => handleNavClick('/solutions', e)}>
            3-DOF Motion Platform
          </a>
          <a href="/solutions" onClick={(e) => handleNavClick('/solutions', e)}>
            6-DOF Motion Platform
          </a>
        </div>

        {/* REGISTERED ADDRESS COLUMN */}
        <div className="footer-links-column">
          <span className="column-title font-mono">REGISTERED ADDRESS</span>
          <div style={{ fontSize: '0.85rem', margin: '0.4rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }} className="font-mono">
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
              <MapPin size={18} style={{ color: '#E31B23', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ color: '#d4d4d8', lineHeight: '1.45' }}>
                {CONTACT_CONFIG.ADDRESS_LINES.map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              <Mail size={18} style={{ color: '#E31B23', flexShrink: 0 }} />
              <a href={`mailto:${CONTACT_CONFIG.SUPPORT_EMAIL}`} className="footer-contact-email">
                {CONTACT_CONFIG.SUPPORT_EMAIL}
              </a>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              <Mail size={18} style={{ color: '#E31B23', flexShrink: 0 }} />
              <a href={`mailto:${CONTACT_CONFIG.ENQUIRY_EMAIL}`} className="footer-contact-email">
                {CONTACT_CONFIG.ENQUIRY_EMAIL}
              </a>
            </div>
          </div>
        </div>

        {/* MAKE IN INDIA COLUMN */}
        <div className="footer-links-column footer-make-in-india-col">
          <div className="footer-logo-link make-in-india-link">
            <img
              src={makeInIndiaDark}
              alt="Make in India Logo"
              className="footer-brand-logo make-in-india-logo"
            />
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="footer-bottom-bar">
        <div className="bottom-container font-mono" style={{ justifyContent: 'center', textAlign: 'center', display: 'flex' }}>
          <span className="footer-copyright-text">&copy; {new Date().getFullYear()} AE Simulators. ALL RIGHTS RESERVED.</span>
        </div>
      </div>
    </footer>
  );
}
