import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function FinalCTA({ navigate }) {
  const handleClick = (e) => {
    if (e) e.preventDefault();
    if (navigate) navigate('/contact');
    else window.location.href = '/contact';
  };

  return (
    <section className="section-block contact-cta-section">
      <div className="cta-box ae-card">
        <div className="cta-text">
          <h2>READY TO BUILD YOUR SIMULATION?</h2>
          <p>Talk to our engineering team about a simulator solution tailored to your specific training requirements.</p>
        </div>
        <div className="cta-action">
          <a
            href="/contact"
            className="contact-us-red-btn"
            onClick={handleClick}
          >
            CONTACT US <ArrowRight size={18} style={{ marginLeft: '8px' }} />
          </a>
        </div>
      </div>
    </section>
  );
}
