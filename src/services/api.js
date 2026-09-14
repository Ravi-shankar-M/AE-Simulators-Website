/**
 * API Service Client — AE-SIMULATORS
 * Client service to communicate with Express backend for Careers Applications, OTP Verification, and WhatsApp.
 */

const API_BASE = '/api';

export async function initSession() {
  try {
    const res = await fetch(`${API_BASE}/verify/init-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    return data.success ? data.sessionId : null;
  } catch (err) {
    console.error('Failed to init verification session:', err);
    return null;
  }
}

export async function sendOtp({ sessionId, type, destination }) {
  try {
    const res = await fetch(`${API_BASE}/verify/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, type, destination }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return {
      success: false,
      error: 'NETWORK_ERROR',
      message: 'Unable to connect to the verification service. Please try again.',
    };
  }
}

export async function verifyOtp({ sessionId, type, otp }) {
  try {
    const res = await fetch(`${API_BASE}/verify/check-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, type, otp }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return {
      success: false,
      error: 'NETWORK_ERROR',
      message: 'Unable to verify code. Please check your connection.',
    };
  }
}

export async function submitCareerApplication({ sessionId, fullName, phone, email, jobRole, additionalInfo, resumeFile }) {
  try {
    const formData = new FormData();
    if (sessionId) formData.append('sessionId', sessionId);
    formData.append('fullName', fullName);
    formData.append('phone', phone);
    formData.append('email', email);
    formData.append('jobRole', jobRole || 'General Engineering Application');
    if (additionalInfo) formData.append('additionalInfo', additionalInfo);
    formData.append('resume', resumeFile);

    const res = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    return data;
  } catch (err) {
    return {
      success: false,
      error: 'NETWORK_ERROR',
      message: 'Unable to send your application right now. Please try again.',
    };
  }
}

export async function sendContactEnquiry({ name, company, email, phone, requirement, message }) {
  try {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, company, email, phone, requirement, message }),
    });

    let data;
    try {
      data = await res.json();
    } catch (parseErr) {
      data = null;
    }

    if (!res.ok) {
      if (res.status === 429) {
        return {
          success: false,
          error: 'RATE_LIMITED',
          message: 'Too many requests. Please wait a few minutes before trying again.',
        };
      }
      if (res.status === 400 && data?.message) {
        return {
          success: false,
          error: data.error || 'INVALID_INPUT',
          message: data.message,
        };
      }
      if (res.status >= 500) {
        return {
          success: false,
          error: 'SERVER_ERROR',
          message: 'Our server encountered a temporary issue. Please try again shortly.',
        };
      }
      return {
        success: false,
        error: data?.error || 'REQUEST_FAILED',
        message: data?.message || 'Unable to send your enquiry right now. Please try again in a few moments.',
      };
    }

    return data || { success: false, message: 'Received empty response from server.' };
  } catch (err) {
    return {
      success: false,
      error: 'NETWORK_ERROR',
      message: "Sorry, we couldn't send your enquiry right now. Please check your connection and try again.",
    };
  }
}

export async function sendWhatsAppEnquiry(payload) {
  try {
    const message = typeof payload === 'string'
      ? payload
      : (payload?.message || payload?.requirement || payload?.name || '');

    const res = await fetch(`${API_BASE}/whatsapp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return {
      success: false,
      error: 'NETWORK_ERROR',
      message: 'Unable to connect to WhatsApp service.',
    };
  }
}
