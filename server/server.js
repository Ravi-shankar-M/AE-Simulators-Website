import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import dns from 'dns';

// Force Node process to prefer IPv4 over IPv6 system-wide
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {
  // Ignore on Node versions that do not support this call
}

import { initSession, getSession, sendOtp, checkOtp } from './otpService.js';
import { sendApplicationEmail, sendContactEmail, verifySmtpConfiguration } from './emailService.js';
import { processWhatsAppMessage } from './whatsappService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure temporary storage folder exists (NOT statically served)
const tempStorageDir = path.resolve(process.cwd(), 'server/storage/temp_resumes');
if (!fs.existsSync(tempStorageDir)) {
  fs.mkdirSync(tempStorageDir, { recursive: true });
}

// Professional HTTP Security Headers
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        'default-src': ["'self'", 'http:', 'https:', 'data:', 'blob:'],
        'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https:', 'blob:'],
        'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
        'img-src': ["'self'", 'data:', 'blob:', 'https:'],
        'media-src': ["'self'", 'data:', 'blob:', 'https:'],
        'connect-src': ["'self'", 'http:', 'https:', 'ws:', 'wss:'],
        'worker-src': ["'self'", 'blob:'],
        'object-src': ["'none'"],
      },
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xContentTypeOptions: true,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginEmbedderPolicy: false,
  })
);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, error: 'RATE_LIMITED', message: 'Too many requests from this IP. Please try again later.' },
});
app.use('/api/', apiLimiter);

// Strict Rate Limiter for OTP operations
const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20,
  message: { success: false, error: 'TOO_MANY_REQUESTS', message: 'Too many OTP requests. Please wait 10 minutes before requesting another code.' },
});

// Configure Multer for Temporary Secure File Uploads
const ACCEPTED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.txt', '.rtf'];
const ACCEPTED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'application/rtf',
  'text/rtf',
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempStorageDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExt = ACCEPTED_EXTENSIONS.includes(ext) ? ext : '.pdf';
    const tempUuid = `temp_${crypto.randomUUID()}${safeExt}`;
    cb(null, tempUuid);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ACCEPTED_EXTENSIONS.includes(ext) || !ACCEPTED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new Error('Invalid file format. Allowed formats: PDF, DOC, DOCX, TXT, RTF.'));
    }
    cb(null, true);
  },
});

// ─────────────────────────────────────────────────────────────
// PUBLIC API ENDPOINTS
// ─────────────────────────────────────────────────────────────

// 1. Health Check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'AE-SIMULATORS API is running.',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// 2. Init Verification Session
app.post('/api/verify/init-session', (req, res) => {
  try {
    const sessionId = initSession();
    res.json({ success: true, sessionId });
  } catch (err) {
    res.status(500).json({ success: false, error: 'INIT_FAILED', message: 'Unable to connect to the verification service.' });
  }
});

// 3. Send OTP
app.post('/api/verify/send-otp', otpLimiter, async (req, res) => {
  try {
    const result = await sendOtp(req.body);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: 'SEND_FAILED', message: 'Unable to send verification code. Please try again.' });
  }
});

// 4. Check / Verify OTP
app.post('/api/verify/check-otp', (req, res) => {
  try {
    const result = checkOtp(req.body);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: 'VERIFY_FAILED', message: 'Unable to verify code. Please try again.' });
  }
});

// 5. Submit Careers Application (Email Delivery & Temp File Cleanup)
app.post('/api/applications', upload.single('resume'), async (req, res) => {
  const file = req.file;
  const { sessionId, fullName, phone, email, jobRole, additionalInfo } = req.body;

  if (!file) {
    return res.status(400).json({ success: false, error: 'MISSING_RESUME', message: 'Please upload your resume document (Max 2 MB).' });
  }

  if (!fullName || !phone || !email) {
    if (file && file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
    return res.status(400).json({ success: false, error: 'MISSING_FIELDS', message: 'Full name, phone number, and email address are required.' });
  }

  // Server-Side Verification Enforcement
  let session = null;
  if (sessionId) {
    session = getSession(sessionId);
  }

  const isPhoneVerified = session ? Boolean(session.phoneVerified) : true;
  const isEmailVerified = session ? Boolean(session.emailVerified) : true;

  if (!isPhoneVerified || !isEmailVerified) {
    if (file && file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
    return res.status(400).json({
      success: false,
      error: 'UNVERIFIED_CONTACT',
      message: 'Please verify both your phone number and email address before confirming your application.',
    });
  }

  try {
    const result = await sendApplicationEmail({
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      jobRole: jobRole || 'General Engineering Application',
      additionalInfo: additionalInfo ? additionalInfo.trim() : '',
      file,
    });

    res.status(200).json(result);
  } catch (err) {
    console.error('Application Submission Error:', err);
    if (file && file.path && fs.existsSync(file.path)) {
      try { fs.unlinkSync(file.path); } catch {}
    }
    res.status(500).json({
      success: false,
      error: 'SUBMISSION_FAILED',
      message: 'Unable to send your application right now. Please try again.',
    });
  }
});

// 6. Contact Form Submission (Transmits enquiry directly to ravishankarm.ae@gmail.com)
app.post('/api/contact', async (req, res) => {
  try {
    const { name, company, email, phone, requirement, message } = req.body;

    const trimmedName = String(name || '').trim();
    const trimmedEmail = String(email || '').trim();
    const trimmedPhone = String(phone || '').trim();
    const trimmedMessage = String(message || '').trim();

    if (!trimmedName || !trimmedEmail || !trimmedPhone) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_FIELDS',
        message: 'Name, email address, and phone number are required fields.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_EMAIL',
        message: 'Please enter a valid email address.',
      });
    }

    const result = await sendContactEmail({
      name: trimmedName,
      company: String(company || '').trim(),
      email: trimmedEmail,
      phone: trimmedPhone,
      requirement: String(requirement || 'General Enquiry').trim(),
      message: trimmedMessage,
    });
    res.json(result);
  } catch (err) {
    console.error('Contact Form Processing Error:', err);
    res.status(500).json({
      success: false,
      error: 'CONTACT_FAILED',
      message: "Sorry, we couldn't send your enquiry right now. Please try again in a few moments.",
    });
  }
});

// 7. WhatsApp Message Handler — Transmit ONLY the exact user entered message
app.post('/api/whatsapp/send', async (req, res) => {
  try {
    const { message, requirement, name, location } = req.body;
    const userMessage = String(message || requirement || name || location || '').trim();
    const result = await processWhatsAppMessage({ message: userMessage });
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: 'WHATSAPP_FAILED', message: 'Failed to process WhatsApp request.' });
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Exception:', err.message);
  res.status(500).json({ success: false, error: 'SERVER_ERROR', message: err.message || 'Internal Server Error' });
});

app.listen(PORT, async () => {
  console.log(`[AE-SIMULATORS SERVER] Production-Ready Server running on port ${PORT}`);
  await verifySmtpConfiguration();
});
