import React, { useState } from 'react';
import { sendContactEnquiry } from '../../../services/api';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    requirement: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setErrorMessage('');

    const trimmedName = formData.name.trim();
    const trimmedCompany = formData.company.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedPhone = formData.phone.trim();
    const trimmedMessage = formData.requirement.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPhone) {
      setErrorMessage('Name, email address, and phone number are required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);

    const result = await sendContactEnquiry({
      name: trimmedName,
      company: trimmedCompany,
      email: trimmedEmail,
      phone: trimmedPhone,
      requirement: 'Technical Consultation',
      message: trimmedMessage || 'Requesting technical consultation for simulator deployment.',
    });

    setSubmitting(false);

    if (result && result.success) {
      setSubmitted(true);
    } else {
      setErrorMessage(
        result?.message || "Sorry, we couldn't send your enquiry right now. Please try again in a few moments."
      );
    }
  };

  return (
    <section id="contact-form" className="section-container">
      <div className="contact-split-grid">
        {/* LEFT COLUMN: Large Editorial Headline */}
        <div>
          <span className="section-headline-eyebrow">08 // INITIATE CONSULTATION</span>
          <h2 className="section-headline" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.8rem)' }}>
            LET'S BUILD <span>THE NEXT DRIVE.</span>
          </h2>
          <p className="section-description" style={{ marginTop: '1.2rem' }}>
            Speak directly with our engineering team to evaluate simulator specifications, motion platform requirements, or request a technical demonstration.
          </p>

          <div style={{ marginTop: '2.5rem' }} className="font-mono">
            <a
              href="mailto:aesimulators@outlook.com"
              style={{ color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }}
            >
              <span style={{ color: '#a1a1aa' }}>Email :&nbsp;</span>aesimulators@outlook.com
            </a>
          </div>
        </div>

        {/* RIGHT COLUMN: Dark Industrial Form Design */}
        <div className="contact-form-card">
          {submitted ? (
            <div style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>✓</span>
              <h3 className="section-headline" style={{ fontSize: '1.8rem' }}>CONSULTATION REQUESTED</h3>
              <p style={{ color: '#94a3b8', marginTop: '0.8rem' }}>
                Thank you for your enquiry. Your message has been sent successfully. Our team will get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="industrial-form">
              {errorMessage && (
                <div
                  style={{
                    background: 'rgba(227, 27, 35, 0.1)',
                    border: '1px solid #E31B23',
                    color: '#E31B23',
                    padding: '10px 14px',
                    borderRadius: '4px',
                    marginBottom: '16px',
                    fontSize: '0.82rem',
                  }}
                  className="font-mono"
                >
                  {errorMessage}
                </div>
              )}

              <div className="form-group">
                <label className="tech-mono">NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="industrial-input"
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label className="tech-mono">ORGANIZATION / COMPANY</label>
                <input
                  type="text"
                  placeholder="Driving School / Fleet Name"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="industrial-input"
                  disabled={submitting}
                />
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label className="tech-mono">EMAIL ADDRESS *</label>
                  <input
                    type="email"
                    required
                    placeholder="email@company.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="industrial-input"
                    disabled={submitting}
                  />
                </div>
                <div className="form-group">
                  <label className="tech-mono">PHONE NUMBER *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="industrial-input"
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="tech-mono">MESSAGE</label>
                <textarea
                  rows="4"
                  placeholder="Describe your fleet size, motion platform interest, or custom software requirements..."
                  value={formData.requirement}
                  onChange={(e) => handleInputChange('requirement', e.target.value)}
                  className="industrial-input"
                  disabled={submitting}
                />
              </div>

              <button
                type="submit"
                className="btn-primary-hero"
                style={{ width: '100%', justifyContent: 'center', opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
                disabled={submitting}
              >
                {submitting ? 'Sending...' : 'Send Enquiry →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
