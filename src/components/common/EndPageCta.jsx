import React from 'react';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import './EndPageCta.css';

export default function EndPageCta({
  sublabel = '',
  title = 'READY TO BUILD THE NEXT GENERATION OF SIMULATION?',
  description = 'Tell us about your simulator hardware, software engine, or driver evaluation requirements. AE Simulators is ready to assist.',
  buttonText = 'CONTACT US',
  navigate,
}) {
  const handleCtaClick = (e) => {
    if (e) e.preventDefault();
    if (navigate) navigate('/contact');
    else window.location.href = '/contact';
  };

  return (
    <section className="section-block end-page-cta-section" aria-label="Next Steps & Contact">
      <ScrollReveal variant="scale-up" duration={700}>
        <div className="end-cta-card ae-card">
          <div className="end-cta-content">
            {sublabel && <span className="section-sublabel font-mono text-ae-red">{sublabel}</span>}
            <h2 className="end-cta-title font-heading">{title}</h2>
            <p className="end-cta-desc font-body">{description}</p>
            
            {/* OFFICIAL CONTACT EMAIL LINK — CAPITALIZED Email */}
            <div className="end-cta-email-wrapper font-mono" style={{ marginTop: '1.2rem', textAlign: 'left', display: 'flex', justifyContent: 'flex-start' }}>
              <a
                href="mailto:aesimulators@outlook.com"
                className="end-cta-email-link font-mono"
                style={{ color: '#FFFFFF', textDecoration: 'none', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center' }}
              >
                <span style={{ color: '#a1a1aa' }}>Email :&nbsp;</span>aesimulators@outlook.com
              </a>
            </div>
          </div>

          <div className="end-cta-action">
            <a href="/contact" className="contact-us-red-btn" onClick={handleCtaClick}>
              {buttonText} <ArrowRight size={18} style={{ marginLeft: '8px' }} />
            </a>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
