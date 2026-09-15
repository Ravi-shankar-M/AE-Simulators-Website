import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Upload,
  FileText,
  X,
  CheckCircle2,
  Phone,
  Mail,
  Loader2,
  ShieldCheck,
  Users,
  Cpu,
} from 'lucide-react';
import ScrollReveal from '../../components/common/ScrollReveal';
import { initSession, sendOtp, verifyOtp, submitCareerApplication } from '../../services/api';
import './Careers.css';

const MAX_RESUME_BYTES = 2 * 1024 * 1024; // 2 MB
const ACCEPTED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.txt', '.rtf'];

const STEPS = [
  { id: 1, label: '1. APPLICATION DETAILS' },
  { id: 2, label: '2. VERIFY & CONFIRM' },
];

function formatBytes(bytes) {
  if (!bytes) return '0 B';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function validateResumeFile(file) {
  if (!file) return 'Please upload your resume / CV.';
  if (file.size === 0) return 'Resume file is empty. Please select a valid document.';

  const ext = '.' + file.name.split('.').pop().toLowerCase();
  if (!ACCEPTED_EXTENSIONS.includes(ext)) {
    return `Unsupported file format (${ext}). Allowed formats: PDF, DOC, DOCX, TXT, RTF.`;
  }

  if (file.size > MAX_RESUME_BYTES) {
    return `Resume exceeds maximum 2 MB limit. Your file is ${formatBytes(file.size)}.`;
  }

  return null;
}

export default function CareersPage({ navigate }) {
  const [sessionId, setSessionId] = useState(null);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    jobRole: 'Simulation Software Engineer',
    additionalInfo: '',
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [resumeError, setResumeError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Verification States & Resend Cooldowns (60s)
  const [phoneSent, setPhoneSent] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneSending, setPhoneSending] = useState(false);
  const [phoneVerifying, setPhoneVerifying] = useState(false);
  const [phoneOtpError, setPhoneOtpError] = useState('');
  const [phoneOtpInfo, setPhoneOtpInfo] = useState('');
  const [phoneCooldown, setPhoneCooldown] = useState(0);

  const [emailSent, setEmailSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [emailVerifying, setEmailVerifying] = useState(false);
  const [emailOtpError, setEmailOtpError] = useState('');
  const [emailOtpInfo, setEmailOtpInfo] = useState('');
  const [emailCooldown, setEmailCooldown] = useState(0);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Initialize verification session on mount
  useEffect(() => {
    initSession().then((sid) => {
      if (sid) setSessionId(sid);
    });
  }, []);

  // Countdown Timers for Resend OTP (60s)
  useEffect(() => {
    let timer;
    if (phoneCooldown > 0) {
      timer = setInterval(() => setPhoneCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [phoneCooldown]);

  useEffect(() => {
    let timer;
    if (emailCooldown > 0) {
      timer = setInterval(() => setEmailCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [emailCooldown]);

  const handleNavigate = (path, e) => {
    if (e) e.preventDefault();
    if (navigate) navigate(path);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleResumeSelect = (file) => {
    if (!file) return;
    const err = validateResumeFile(file);
    if (err) {
      setResumeError(err);
      setResumeFile(null);
    } else {
      setResumeError('');
      setResumeFile(file);
    }
  };

  const validateStep1 = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Full name is required.';

    if (!form.phone.trim()) {
      errors.phone = 'Phone number is required.';
    } else if (!/^\+?[\d\s\-()]{7,15}$/.test(form.phone.trim())) {
      errors.phone = 'Enter a valid phone number (e.g. +91 93457 64379).';
    }

    if (!form.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = 'Enter a valid email address.';
    }

    const rErr = validateResumeFile(resumeFile);
    if (rErr) setResumeError(rErr);
    else setResumeError('');

    setFormErrors(errors);
    return Object.keys(errors).length === 0 && !rErr;
  };

  const handleStep1Next = () => {
    if (validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  // Step 2 OTP Handlers
  const handleSendPhoneOtp = async () => {
    if (phoneCooldown > 0) return;
    setPhoneSending(true);
    setPhoneOtpError('');
    setPhoneOtpInfo('');

    let activeSid = sessionId;
    if (!activeSid) {
      activeSid = await initSession();
      if (activeSid) setSessionId(activeSid);
    }

    if (!activeSid) {
      setPhoneSending(false);
      setPhoneOtpError('Unable to connect to the verification service. Please ensure backend server is running.');
      return;
    }

    let res = await sendOtp({
      sessionId: activeSid,
      type: 'phone',
      destination: form.phone,
    });

    if (!res.success && res.error === 'SESSION_EXPIRED') {
      activeSid = await initSession();
      if (activeSid) {
        setSessionId(activeSid);
        res = await sendOtp({
          sessionId: activeSid,
          type: 'phone',
          destination: form.phone,
        });
      }
    }

    setPhoneSending(false);
    if (res.success) {
      setPhoneSent(true);
      setPhoneCooldown(60); // 60s cooldown timer
      setPhoneOtpInfo(`Verification code sent successfully to ${form.phone}. Check your phone for the verification code.`);
    } else {
      setPhoneOtpError(res.message || 'Unable to send verification code.');
    }
  };

  const handleVerifyPhoneOtp = async () => {
    if (!phoneOtp.trim()) return;
    setPhoneVerifying(true);
    setPhoneOtpError('');

    const res = await verifyOtp({
      sessionId,
      type: 'phone',
      otp: phoneOtp.trim(),
    });

    setPhoneVerifying(false);
    if (res.success) {
      setPhoneVerified(true);
      setPhoneOtpInfo('Phone number verified successfully.');
    } else {
      setPhoneOtpError(res.message || 'Incorrect verification code. Please try again.');
    }
  };

  const handleSendEmailOtp = async () => {
    if (emailCooldown > 0) return;
    setEmailSending(true);
    setEmailOtpError('');
    setEmailOtpInfo('');

    let activeSid = sessionId;
    if (!activeSid) {
      activeSid = await initSession();
      if (activeSid) setSessionId(activeSid);
    }

    if (!activeSid) {
      setEmailSending(false);
      setEmailOtpError('Unable to connect to the verification service. Please ensure backend server is running.');
      return;
    }

    let res = await sendOtp({
      sessionId: activeSid,
      type: 'email',
      destination: form.email,
    });

    if (!res.success && res.error === 'SESSION_EXPIRED') {
      activeSid = await initSession();
      if (activeSid) {
        setSessionId(activeSid);
        res = await sendOtp({
          sessionId: activeSid,
          type: 'email',
          destination: form.email,
        });
      }
    }

    setEmailSending(false);
    if (res.success) {
      setEmailSent(true);
      setEmailCooldown(60); // 60s cooldown timer
      setEmailOtpInfo(`Verification code sent successfully to ${form.email}. Check your email for the verification code.`);
    } else {
      setEmailOtpError(res.message || 'Unable to send verification code.');
    }
  };

  const handleVerifyEmailOtp = async () => {
    if (!emailOtp.trim()) return;
    setEmailVerifying(true);
    setEmailOtpError('');

    const res = await verifyOtp({
      sessionId,
      type: 'email',
      otp: emailOtp.trim(),
    });

    setEmailVerifying(false);
    if (res.success) {
      setEmailVerified(true);
      setEmailOtpInfo('Email address verified successfully.');
    } else {
      setEmailOtpError(res.message || 'Incorrect verification code. Please try again.');
    }
  };

  // Final Confirmation Handler (Submits application & sends email to aesimulators@outlook.com)
  const handleConfirmApplication = async () => {
    if (!phoneVerified || !emailVerified) {
      setSubmitError('Please verify your phone number and email address before confirming your application.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    const res = await submitCareerApplication({
      sessionId,
      fullName: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      jobRole: form.jobRole,
      additionalInfo: form.additionalInfo.trim(),
      resumeFile,
    });

    setSubmitting(false);
    if (res.success) {
      setSubmitted(true);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    } else {
      setSubmitError(res.message || 'Unable to send your application right now. Please try again.');
    }
  };

  return (
    <div className="careers-page-container font-body">
      {/* ── HERO BANNER ── */}
      <section className="hero-section text-hero-clean" aria-label="Careers Hero Banner">
        <ScrollReveal variant="fade-up">
          <div className="section-content hero-content">
            <div className="tech-badge">
              <span className="badge-dot" />
              CAREERS &amp; ENGINEERING OPPORTUNITIES
            </div>

            <h1 className="hero-title">
              JOIN OUR <span className="text-ae-red">TEAM</span>
            </h1>

            <p className="hero-subtext font-body">
              Build the future of electromechanical motion platforms, real-time vehicle dynamics simulation, and automated driver evaluation software with AE Simulators.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* ── WHY JOIN SECTION ── */}
      <section className="section-block section-white" aria-labelledby="why-join-title">
        <ScrollReveal variant="fade-up">
          <div className="section-header center-header">
            <span className="section-sublabel text-ae-red font-mono">ENGINEERING CULTURE</span>
            <h2 className="section-title" id="why-join-title">WHY BUILD AT AE SIMULATORS?</h2>
            <div className="section-title-line" />
          </div>
        </ScrollReveal>

        <div className="careers-feature-grid">
          <ScrollReveal variant="scale-up" delay={0.1}>
            <div className="careers-feature-card ae-card">
              <div className="careers-card-icon-box">
                <Cpu size={30} className="text-ae-red" />
              </div>
              <h3 className="careers-card-title font-heading">REAL HARDWARE &amp; SOFTWARE</h3>
              <p className="careers-card-desc font-body">
                Work directly on 6-DOF hexapod platforms, CAN bus actuators, physical cockpit rigs, and physics engines.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="scale-up" delay={0.2}>
            <div className="careers-feature-card ae-card">
              <div className="careers-card-icon-box">
                <Users size={30} className="text-ae-red" />
              </div>
              <h3 className="careers-card-title font-heading">HIGH IMPACT ROLE</h3>
              <p className="careers-card-desc font-body">
                Our focused team gives every engineer direct ownership over major subsystems deployed into real-world projects.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="scale-up" delay={0.3}>
            <div className="careers-feature-card ae-card">
              <div className="careers-card-icon-box">
                <ShieldCheck size={30} className="text-ae-red" />
              </div>
              <h3 className="careers-card-title font-heading">INDUSTRIAL STANDARDS</h3>
              <p className="careers-card-desc font-body">
                We design for heavy-duty industrial reliability, zero-lag dynamic motion, and rigorous driver safety.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 2-STEP PUBLIC APPLICATION SECTION ── */}
      <section className="careers-application-section" id="apply" aria-labelledby="apply-title">
        <div className="careers-form-wrapper">
          <ScrollReveal variant="fade-up">
            <div className="section-header" style={{ marginBottom: '2rem', textAlign: 'left' }}>
              <span className="section-sublabel text-ae-red font-mono">OPEN APPLICATION</span>
              <h2 className="section-title" id="apply-title">JOIN OUR TEAM</h2>
            </div>
          </ScrollReveal>

          {/* STEP PROGRESS INDICATOR */}
          {!submitted && (
            <div className="step-progress-bar" role="list" aria-label="Application Steps">
              {STEPS.map((st) => (
                <div
                  key={st.id}
                  className={`step-bar-item ${step === st.id ? 'active' : ''} ${
                    step > st.id ? 'completed' : ''
                  }`}
                >
                  <div className="step-bar-number font-mono">{step > st.id ? '✓' : st.id}</div>
                  <span className="step-bar-label font-mono">{st.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* SUCCESS CONFIRMATION SCREEN */}
          {submitted ? (
            <div className="careers-form-card ae-card">
              <div className="careers-success-screen">
                <div className="success-icon-pulse">
                  <CheckCircle2 size={64} className="text-ae-red" />
                </div>
                <h2 className="careers-success-title font-heading">APPLICATION RECEIVED</h2>
                <p className="careers-success-sub font-body">
                  Thank you for your application. Your details and resume have been successfully submitted to our recruitment team at <strong>aesimulators@outlook.com</strong>.
                </p>

                <p className="font-body" style={{ color: '#a1a1aa', fontSize: '0.92rem', marginTop: '1rem' }}>
                  Our engineering team will review your application and contact you if your profile matches an opening.
                </p>

                <div className="careers-success-actions" style={{ marginTop: '2rem' }}>
                  <a href="/" className="btn-primary" onClick={(e) => handleNavigate('/', e)}>
                    RETURN TO DASHBOARD <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="careers-form-card ae-card">
              {/* STEP 1: APPLICATION DETAILS */}
              {step === 1 && (
                <div className="careers-step-panel">
                  <div className="step-panel-header">
                    <h3 className="careers-step-title font-heading">STEP 1 — APPLICATION DETAILS</h3>
                    <p className="careers-step-desc font-body">
                      Enter your contact information and attach your resume / CV below.
                    </p>
                  </div>

                  <div className="careers-form-row-2">
                    <div className="careers-form-group">
                      <label className="careers-form-label font-mono" htmlFor="careers-name">
                        Full Name *
                      </label>
                      <input
                        id="careers-name"
                        type="text"
                        name="name"
                        className={`careers-form-input ${formErrors.name ? 'error' : ''}`}
                        placeholder="e.g. Rahul Sharma"
                        value={form.name}
                        onChange={handleFormChange}
                      />
                      {formErrors.name && <span className="field-error">{formErrors.name}</span>}
                    </div>

                    <div className="careers-form-group">
                      <label className="careers-form-label font-mono" htmlFor="careers-phone">
                        Phone Number *
                      </label>
                      <input
                        id="careers-phone"
                        type="tel"
                        name="phone"
                        className={`careers-form-input ${formErrors.phone ? 'error' : ''}`}
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={handleFormChange}
                      />
                      {formErrors.phone && <span className="field-error">{formErrors.phone}</span>}
                    </div>
                  </div>

                  <div className="careers-form-row-2">
                    <div className="careers-form-group">
                      <label className="careers-form-label font-mono" htmlFor="careers-email">
                        Email Address *
                      </label>
                      <input
                        id="careers-email"
                        type="email"
                        name="email"
                        className={`careers-form-input ${formErrors.email ? 'error' : ''}`}
                        placeholder="name@domain.com"
                        value={form.email}
                        onChange={handleFormChange}
                      />
                      {formErrors.email && <span className="field-error">{formErrors.email}</span>}
                    </div>

                    <div className="careers-form-group">
                      <label className="careers-form-label font-mono" htmlFor="careers-role">
                        Position / Role
                      </label>
                      <select
                        id="careers-role"
                        name="jobRole"
                        className="careers-form-select"
                        value={form.jobRole}
                        onChange={handleFormChange}
                      >
                        <option value="Simulation Software Engineer">Simulation Software Engineer</option>
                        <option value="Motion Control &amp; Kinematics Specialist">Motion Control &amp; Kinematics Specialist</option>
                        <option value="Automotive Electronics Engineer">Automotive Electronics Engineer</option>
                        <option value="CAD &amp; Mechanical Design Engineer">CAD &amp; Mechanical Design Engineer</option>
                        <option value="Driver Evaluation &amp; Telemetry Analyst">Driver Evaluation &amp; Telemetry Analyst</option>
                        <option value="General Engineering Application">General Engineering Application</option>
                      </select>
                    </div>
                  </div>

                  {/* RESUME UPLOAD ZONE */}
                  <div className="careers-form-group">
                    <label className="careers-form-label font-mono">
                      Resume / CV (PDF, DOC, DOCX, TXT, RTF — Max 2 MB) *
                    </label>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.txt,.rtf"
                      style={{ display: 'none' }}
                      onChange={(e) => e.target.files && handleResumeSelect(e.target.files[0])}
                    />

                    {!resumeFile ? (
                      <div
                        className={`resume-upload-zone ${dragOver ? 'drag-over' : ''} ${
                          resumeError ? 'error' : ''
                        }`}
                        onDrop={(e) => {
                          e.preventDefault();
                          setDragOver(false);
                          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            handleResumeSelect(e.dataTransfer.files[0]);
                          }
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDragOver(true);
                        }}
                        onDragLeave={() => setDragOver(false)}
                        onClick={() => fileInputRef.current?.click()}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="resume-upload-icon">
                          <Upload size={32} className="text-ae-red" />
                        </div>
                        <span className="resume-upload-label font-heading">
                          CLICK TO SELECT OR DRAG &amp; DROP RESUME HERE
                        </span>
                        <span className="resume-upload-hint font-mono">
                          Accepted: PDF, DOC, DOCX, TXT, RTF (Maximum 2 MB)
                        </span>
                      </div>
                    ) : (
                      <div className="resume-selected-box">
                        <FileText size={24} className="text-ae-red" />
                        <div className="resume-file-info">
                          <span className="resume-filename font-heading">{resumeFile.name}</span>
                          <span className="resume-filesize font-mono">{formatBytes(resumeFile.size)}</span>
                        </div>
                        <button
                          type="button"
                          className="resume-remove-btn"
                          onClick={() => {
                            setResumeFile(null);
                            setResumeError('');
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          aria-label="Remove uploaded resume"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    )}

                    {resumeError && <span className="field-error">{resumeError}</span>}
                  </div>

                  {/* ADDITIONAL INFORMATION */}
                  <div className="careers-form-group">
                    <label className="careers-form-label font-mono" htmlFor="careers-notes">
                      Additional Information / Notes (Optional)
                    </label>
                    <textarea
                      id="careers-notes"
                      name="additionalInfo"
                      rows="3"
                      className="careers-form-input"
                      placeholder="Briefly state your key technical skills, experience, or availability..."
                      value={form.additionalInfo}
                      onChange={handleFormChange}
                    />
                  </div>

                  <div className="careers-form-actions">
                    <div />
                    <button type="button" className="btn-primary careers-btn-next" onClick={handleStep1Next}>
                      NEXT — VERIFY &amp; CONFIRM <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: VERIFY & CONFIRM (PHONE & EMAIL VERIFICATION TOGETHER ON ONE SCREEN) */}
              {step === 2 && (
                <div className="careers-step-panel">
                  <div className="step-panel-header">
                    <h3 className="careers-step-title font-heading">STEP 2 — VERIFY &amp; CONFIRM</h3>
                    <p className="careers-step-desc font-body">
                      Verify both your phone number and email address below on this screen before final confirmation.
                    </p>
                  </div>

                  <div className="otp-combined-screen">
                    {/* PHONE VERIFICATION BOX */}
                    <div className={`otp-verification-card ${phoneVerified ? 'verified' : ''}`}>
                      <div className="otp-card-header">
                        <div className="otp-card-icon">
                          <Phone size={20} className="text-ae-red" />
                        </div>
                        <div className="otp-card-titles">
                          <h4 className="otp-card-label font-heading">VERIFY PHONE</h4>
                          <span className="otp-card-value font-mono">{form.phone}</span>
                        </div>
                        {phoneVerified && (
                          <div className="otp-status-badge font-mono">
                            <CheckCircle2 size={14} /> PHONE VERIFIED ✓
                          </div>
                        )}
                      </div>

                      {!phoneVerified ? (
                        <div className="otp-card-body">
                          {!phoneSent ? (
                            <button
                              type="button"
                              className="btn-secondary otp-send-btn font-mono"
                              onClick={handleSendPhoneOtp}
                              disabled={phoneSending}
                            >
                              {phoneSending ? <Loader2 size={14} className="animate-spin" /> : 'SEND PHONE OTP'}
                            </button>
                          ) : (
                            <div className="otp-input-flow">
                              {phoneOtpInfo && <span className="otp-info-msg font-mono">{phoneOtpInfo}</span>}
                              <div className="otp-input-group">
                                <input
                                  type="text"
                                  maxLength={6}
                                  className="careers-form-input otp-digit-input font-mono"
                                  placeholder="ENTER OTP"
                                  value={phoneOtp}
                                  onChange={(e) => setPhoneOtp(e.target.value)}
                                />
                                <button
                                  type="button"
                                  className="btn-primary otp-verify-btn font-mono"
                                  onClick={handleVerifyPhoneOtp}
                                  disabled={phoneVerifying || !phoneOtp.trim()}
                                >
                                  {phoneVerifying ? <Loader2 size={14} className="animate-spin" /> : 'VERIFY PHONE'}
                                </button>
                              </div>
                              <button
                                type="button"
                                className="otp-resend-link font-mono"
                                onClick={handleSendPhoneOtp}
                                disabled={phoneSending || phoneCooldown > 0}
                              >
                                {phoneSending
                                  ? 'Sending…'
                                  : phoneCooldown > 0
                                  ? `RESEND IN ${phoneCooldown}s`
                                  : 'RESEND PHONE OTP'}
                              </button>
                            </div>
                          )}
                          {phoneOtpError && <span className="field-error">{phoneOtpError}</span>}
                        </div>
                      ) : (
                        <div className="otp-verified-banner font-mono">
                          <CheckCircle2 size={18} className="text-ae-red" />
                          <span>PHONE NUMBER VERIFIED ✓</span>
                        </div>
                      )}
                    </div>

                    {/* EMAIL VERIFICATION BOX */}
                    <div className={`otp-verification-card ${emailVerified ? 'verified' : ''}`}>
                      <div className="otp-card-header">
                        <div className="otp-card-icon">
                          <Mail size={20} className="text-ae-red" />
                        </div>
                        <div className="otp-card-titles">
                          <h4 className="otp-card-label font-heading">VERIFY EMAIL</h4>
                          <span className="otp-card-value font-mono">{form.email}</span>
                        </div>
                        {emailVerified && (
                          <div className="otp-status-badge font-mono">
                            <CheckCircle2 size={14} /> EMAIL VERIFIED ✓
                          </div>
                        )}
                      </div>

                      {!emailVerified ? (
                        <div className="otp-card-body">
                          {!emailSent ? (
                            <button
                              type="button"
                              className="btn-secondary otp-send-btn font-mono"
                              onClick={handleSendEmailOtp}
                              disabled={emailSending}
                            >
                              {emailSending ? <Loader2 size={14} className="animate-spin" /> : 'SEND EMAIL OTP'}
                            </button>
                          ) : (
                            <div className="otp-input-flow">
                              {emailOtpInfo && <span className="otp-info-msg font-mono">{emailOtpInfo}</span>}
                              <div className="otp-input-group">
                                <input
                                  type="text"
                                  maxLength={6}
                                  className="careers-form-input otp-digit-input font-mono"
                                  placeholder="ENTER OTP"
                                  value={emailOtp}
                                  onChange={(e) => setEmailOtp(e.target.value)}
                                />
                                <button
                                  type="button"
                                  className="btn-primary otp-verify-btn font-mono"
                                  onClick={handleVerifyEmailOtp}
                                  disabled={emailVerifying || !emailOtp.trim()}
                                >
                                  {emailVerifying ? <Loader2 size={14} className="animate-spin" /> : 'VERIFY EMAIL'}
                                </button>
                              </div>
                              <button
                                type="button"
                                className="otp-resend-link font-mono"
                                onClick={handleSendEmailOtp}
                                disabled={emailSending || emailCooldown > 0}
                              >
                                {emailSending
                                  ? 'Sending…'
                                  : emailCooldown > 0
                                  ? `RESEND IN ${emailCooldown}s`
                                  : 'RESEND EMAIL OTP'}
                              </button>
                            </div>
                          )}
                          {emailOtpError && <span className="field-error">{emailOtpError}</span>}
                        </div>
                      ) : (
                        <div className="otp-verified-banner font-mono">
                          <CheckCircle2 size={18} className="text-ae-red" />
                          <span>EMAIL ADDRESS VERIFIED ✓</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {submitError && <div className="submission-error-banner font-mono">{submitError}</div>}

                  <div className="careers-form-actions">
                    <button type="button" className="btn-secondary careers-btn-back" onClick={() => setStep(1)}>
                      <ArrowLeft size={16} /> BACK TO STEP 1
                    </button>

                    <button
                      type="button"
                      className="btn-primary careers-btn-confirm"
                      onClick={handleConfirmApplication}
                      disabled={!phoneVerified || !emailVerified || submitting}
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> SUBMITTING APPLICATION…
                        </>
                      ) : (
                        <>
                          CONFIRM APPLICATION <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
