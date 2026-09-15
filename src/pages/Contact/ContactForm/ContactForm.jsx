import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import ScrollReveal from '../../../components/common/ScrollReveal';
import { sendContactEnquiry } from '../../../services/api';

import './ContactForm.css';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    requirement: 'GAMING SIMULATORS',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setErrorMessage('');
    setFieldErrors({});

    const trimmedName = formData.name.trim();
    const trimmedCompany = formData.company.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedPhone = formData.phone.trim();
    const trimmedMessage = formData.message.trim();

    const errors = {};
    if (!trimmedName) {
      errors.name = 'Full name is required.';
    }
    if (!trimmedPhone) {
      errors.phone = 'Phone number is required.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      errors.email = 'Email address is required.';
    } else if (!emailRegex.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address (e.g. name@company.com).';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMessage('Please fix the errors in the highlighted fields above.');
      return;
    }

    setSubmitting(true);

    const result = await sendContactEnquiry({
      name: trimmedName,
      company: trimmedCompany,
      email: trimmedEmail,
      phone: trimmedPhone,
      requirement: formData.requirement,
      message: trimmedMessage,
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
    <section className="contact-form-section">
      <div className="contact-single-wrapper">
        <ScrollReveal variant="scale-up" delay={0.1}>
          <div className="contact-form-card">
            {submitted ? (
              <div className="form-success-box font-mono">
                <CheckCircle2 size={40} style={{ color: '#E31B23', margin: '0 auto 12px' }} />
                <h3>ENQUIRY TRANSMITTED SUCCESSFULLY</h3>
                <p>Thank you for your enquiry. Your message has been sent successfully. Our team will get back to you shortly.</p>
                <button
                  className="btn-secondary"
                  style={{ marginTop: '20px' }}
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', company: '', email: '', phone: '', requirement: 'GAMING SIMULATORS', message: '' });
                  }}
                >
                  SEND ANOTHER ENQUIRY
                </button>
              </div>
            ) : (
              <form className="ae-contact-form" onSubmit={handleSubmit}>
                {errorMessage && (
                  <div
                    style={{
                      background: 'rgba(227, 27, 35, 0.1)',
                      border: '1px solid #E31B23',
                      color: '#E31B23',
                      padding: '12px 16px',
                      borderRadius: '6px',
                      marginBottom: '20px',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                    className="font-mono"
                  >
                    <AlertCircle size={18} style={{ flexShrink: 0 }} />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label font-mono">NAME *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className={`form-input${fieldErrors.name ? ' input-error' : ''}`}
                      disabled={submitting}
                    />
                    {fieldErrors.name && (
                      <span className="field-error-text font-mono" style={{ color: '#E31B23', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                        {fieldErrors.name}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label font-mono">COMPANY</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Organization / Company name"
                      className="form-input"
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label font-mono">EMAIL ADDRESS *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@company.com"
                      className={`form-input${fieldErrors.email ? ' input-error' : ''}`}
                      disabled={submitting}
                    />
                    {fieldErrors.email && (
                      <span className="field-error-text font-mono" style={{ color: '#E31B23', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                        {fieldErrors.email}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label font-mono">PHONE NUMBER *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className={`form-input${fieldErrors.phone ? ' input-error' : ''}`}
                      disabled={submitting}
                    />
                    {fieldErrors.phone && (
                      <span className="field-error-text font-mono" style={{ color: '#E31B23', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                        {fieldErrors.phone}
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label font-mono">PRIMARY REQUIREMENT</label>
                  <select
                    name="requirement"
                    value={formData.requirement}
                    onChange={handleChange}
                    className="form-input form-select"
                    disabled={submitting}
                  >
                    <option value="GAMING SIMULATORS">GAMING SIMULATORS</option>
                    <option value="TRAINING SIMULATORS">TRAINING SIMULATORS</option>
                    <option value="OTHERS">OTHERS</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label font-mono">MESSAGE</label>
                  <textarea
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe your simulator project, timeline, or technical requirements..."
                    className="form-input form-textarea"
                    disabled={submitting}
                  />
                </div>

                <button
                  type="submit"
                  className="contact-us-red-btn"
                  style={{ width: '100%', justifyContent: 'center', opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Enquiry <Send size={16} style={{ marginLeft: '8px' }} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

