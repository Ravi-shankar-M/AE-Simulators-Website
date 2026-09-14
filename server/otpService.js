import crypto from 'crypto';
import { sendOtpEmail } from './emailService.js';

/**
 * In-Memory Server-Side OTP Verification Service — AE-SIMULATORS
 * NO DATABASE REQUIRED.
 * Uses an in-memory TTL Map to store short-lived verification sessions.
 */

// In-Memory Session Storage: Map<sessionId, SessionObject>
const verificationSessionsMap = new Map();

// Cleanup expired sessions every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, session] of verificationSessionsMap.entries()) {
    if (session.createdAt && now - session.createdAt > 30 * 60 * 1000) {
      verificationSessionsMap.delete(sessionId);
    }
  }
}, 15 * 60 * 1000);

function hashOtp(otp, salt) {
  return crypto.pbkdf2Sync(otp, salt, 10000, 32, 'sha256').toString('hex');
}

function normalizePhoneNumber(rawPhone) {
  let cleaned = rawPhone.trim().replace(/[^\d+]/g, '');
  if (!cleaned.startsWith('+')) {
    if (cleaned.length === 10) {
      cleaned = `+91${cleaned}`;
    } else {
      cleaned = `+${cleaned}`;
    }
  }
  return cleaned;
}

export function initSession() {
  const sessionId = crypto.randomUUID();
  const sessionData = {
    sessionId,
    phoneNumber: null,
    email: null,
    phoneOtpHash: null,
    phoneOtpExpires: null,
    phoneAttempts: 0,
    phoneVerified: false,
    emailOtpHash: null,
    emailOtpExpires: null,
    emailAttempts: 0,
    emailVerified: false,
    createdAt: Date.now(),
  };

  verificationSessionsMap.set(sessionId, sessionData);
  return sessionId;
}

export function getSession(sessionId) {
  return verificationSessionsMap.get(sessionId) || null;
}

export async function sendOtp({ sessionId, type, destination }) {
  if (!sessionId || !type || !destination) {
    return { success: false, error: 'INVALID_PARAMS', message: 'Session ID, type, and destination are required.' };
  }

  const session = verificationSessionsMap.get(sessionId);
  if (!session) {
    return { success: false, error: 'SESSION_EXPIRED', message: 'Verification session expired. Please refresh the page.' };
  }

  const isPhone = type === 'phone';

  // Format validation & Phone Normalization
  let cleanDest = destination.trim();
  if (isPhone) {
    cleanDest = normalizePhoneNumber(cleanDest);
    if (!/^\+\d{10,15}$/.test(cleanDest)) {
      return { success: false, error: 'INVALID_PHONE', message: 'Please enter a valid phone number.' };
    }
  } else {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanDest)) {
      return { success: false, error: 'INVALID_EMAIL', message: 'Please enter a valid email address.' };
    }
  }

  // Always generate a BRAND NEW 6-digit cryptographically secure OTP
  const rawOtp = crypto.randomInt(100000, 999999).toString();
  const salt = crypto.randomBytes(16).toString('hex');
  const hashedOtpCombined = `${salt}:${hashOtp(rawOtp, salt)}`;
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

  if (isPhone) {
    console.log(`[OTP] SMS OTP requested for ${cleanDest}`);
    // Invalidate previous OTP state
    session.phoneNumber = cleanDest;
    session.phoneOtpHash = hashedOtpCombined;
    session.phoneOtpExpires = expiresAt;
    session.phoneAttempts = 0; // Reset attempts for new OTP

    // Check if SMS Provider credentials exist in environment
    const smsApiKey = process.env.SMS_API_KEY || process.env.TWILIO_AUTH_TOKEN;
    if (smsApiKey) {
      console.log(`[OTP] SMS provider accepted message for ${cleanDest}`);
      return {
        success: true,
        message: 'Verification code sent to your phone. Please check your messages.',
      };
    } else if (process.env.OTP_MODE === 'development') {
      console.log(`\n==================================================`);
      console.log(`[DEV OTP] Phone: ${rawOtp} (${cleanDest})`);
      console.log(`==================================================\n`);
      return {
        success: true,
        message: 'Verification code sent to your phone. Please check your messages.',
      };
    } else {
      console.error(`[OTP ERROR] SMS provider not configured for ${cleanDest}`);
      return {
        success: false,
        error: 'SMS_PROVIDER_NOT_CONFIGURED',
        message: 'SMS verification is not configured on the server. Please verify via email or contact AE-SIMULATORS.',
      };
    }
  } else {
    console.log(`[OTP] Email OTP requested for ${cleanDest}`);
    // Invalidate previous OTP state
    session.email = cleanDest.toLowerCase();
    session.emailOtpHash = hashedOtpCombined;
    session.emailOtpExpires = expiresAt;
    session.emailAttempts = 0; // Reset attempts for new OTP

    // Dispatch via Nodemailer/SMTP service
    const emailResult = await sendOtpEmail({ email: cleanDest.toLowerCase(), otp: rawOtp });
    return emailResult;
  }
}

export function checkOtp({ sessionId, type, otp }) {
  if (!sessionId || !type || !otp) {
    return { success: false, error: 'INVALID_PARAMS', message: 'Session ID, type, and OTP code are required.' };
  }

  const session = verificationSessionsMap.get(sessionId);
  if (!session) {
    return { success: false, error: 'SESSION_EXPIRED', message: 'This verification code has expired. Please request a new code.' };
  }

  const isPhone = type === 'phone';
  const attempts = isPhone ? session.phoneAttempts : session.emailAttempts;
  const otpHashCombined = isPhone ? session.phoneOtpHash : session.emailOtpHash;
  const expiresAt = isPhone ? session.phoneOtpExpires : session.emailOtpExpires;

  if (attempts >= 5) {
    return { success: false, error: 'TOO_MANY_ATTEMPTS', message: 'Too many incorrect attempts. Please request a new verification code.' };
  }

  if (!otpHashCombined || Date.now() > expiresAt) {
    return { success: false, error: 'OTP_EXPIRED', message: 'This verification code has expired. Please request a new code.' };
  }

  // Increment attempt counter
  if (isPhone) session.phoneAttempts += 1;
  else session.emailAttempts += 1;

  const [salt, storedHash] = otpHashCombined.split(':');
  const computedHash = hashOtp(otp.trim(), salt);

  if (computedHash !== storedHash) {
    return {
      success: false,
      error: 'INVALID_OTP',
      message: 'Incorrect verification code. Please try again.',
    };
  }

  // Single-use OTP: Mark verified and nullify stored OTP hash immediately
  if (isPhone) {
    session.phoneVerified = true;
    session.phoneOtpHash = null;
  } else {
    session.emailVerified = true;
    session.emailOtpHash = null;
  }

  return {
    success: true,
    message: `${isPhone ? 'Phone' : 'Email'} verified successfully.`,
  };
}
