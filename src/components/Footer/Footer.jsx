import React from 'react';
import { CONTACT_CONFIG } from '../../config/contact';
import { MapPin, Mail, Phone } from 'lucide-react';
import { ASSETS } from '../../data/assets';
import './Footer.css';
import makeInIndiaFinal from './images/make-in-india-final.png';

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
              src={ASSETS.logo.official}
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
          <a href="/simulators" onClick={(e) => handleNavClick('/simulators', e)}>Simulators</a>
          <a href="/contact" onClick={(e) => handleNavClick('/contact', e)}>Contact Us</a>
        </div>

        {/* SIMULATORS COLUMN */}
        <div className="footer-links-column">
          <span className="column-title font-mono">SIMULATORS</span>
          <a href="/simulators/gaming" onClick={(e) => handleNavClick('/simulators/gaming', e)}>
            Gaming Simulators
          </a>
          <a href="/simulators/training" onClick={(e) => handleNavClick('/simulators/training', e)}>
            Training Simulators
          </a>
        </div>

        {/* REGISTERED ADDRESS COLUMN */}
        <div className="footer-links-column">
          <span className="column-title font-mono">REGISTERED ADDRESS</span>
          <div style={{ fontSize: '0.85rem', margin: '0.4rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }} className="font-mono">
            {CONTACT_CONFIG.ADDRESS_LINES.map((address, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <MapPin size={18} style={{ color: '#E31B23', flexShrink: 0 }} />
                <span style={{ color: '#d4d4d8', lineHeight: '1.45', whiteSpace: 'nowrap' }}>{address}</span>
              </div>
            ))}
          </div>
        </div>

        {/* GET IN TOUCH COLUMN */}
        <div className="footer-links-column">
          <span className="column-title font-mono">GET IN TOUCH</span>
          <div style={{ fontSize: '0.85rem', margin: '0.4rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }} className="font-mono">
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              <Phone size={18} style={{ color: '#E31B23', flexShrink: 0 }} />
              <span className="footer-contact-phone" style={{ color: '#d4d4d8', lineHeight: '1.45' }}>
                {CONTACT_CONFIG.MOBILE_NUMBER || '9945552222'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              <Mail size={18} style={{ color: '#E31B23', flexShrink: 0 }} />
              <span className="footer-contact-email" style={{ color: '#d4d4d8', lineHeight: '1.45' }}>
                {CONTACT_CONFIG.SUPPORT_EMAIL}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              <Mail size={18} style={{ color: '#E31B23', flexShrink: 0 }} />
              <span className="footer-contact-email" style={{ color: '#d4d4d8', lineHeight: '1.45' }}>
                {CONTACT_CONFIG.ENQUIRY_EMAIL}
              </span>
            </div>
          </div>
        </div>

        {/* MAKE IN INDIA COLUMN */}
        <div className="footer-links-column footer-make-in-india-col">
          <div className="footer-logo-link make-in-india-link">
            <img
              src={makeInIndiaFinal}
              alt="Make in India Logo"
              className="footer-brand-logo make-in-india-logo"
            />
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="footer-bottom-bar">
        <div className="bottom-container font-mono" style={{ justifyContent: 'center', textAlign: 'center', display: 'flex' }}>
          <span className="footer-copyright-text">&copy; AE Simulators</span>
        </div>
      </div>
    </footer>
  );
}
