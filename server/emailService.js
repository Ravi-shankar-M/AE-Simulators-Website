import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import fs from 'fs';
import dns from 'dns';

// Force Node.js process DNS result order preference to IPv4
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {
  // Ignore if not supported in older Node versions
}

/**
 * Robust IPv4 DNS Resolver for Nodemailer Transports.
 * Directs DNS resolution to A records (IPv4) matching Node.js dns.lookup contract.
 */
function ipv4Lookup(hostname, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  dns.resolve4(hostname, (err, addresses) => {
    if (err || !addresses || addresses.length === 0) {
      return dns.lookup(hostname, { ...options, family: 4 }, callback);
    }
    if (options && options.all) {
      const resultArray = addresses.map((addr) => ({ address: addr, family: 4 }));
      return callback(null, resultArray);
    }
    return callback(null, addresses[0], 4);
  });
}

const RECEIVER_EMAIL = process.env.APPLICATION_RECEIVER || 'aesimulators@outlook.com';

export function createTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : (port === 465);
  const user = process.env.SMTP_USER || 'ravishankarm.ae@gmail.com';
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      family: 4,
      lookup: ipv4Lookup,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      tls: {
        rejectUnauthorized: true,
      },
    });
  }

  return null;
}

export function isResendConfigured() {
  const apiKey = (process.env.RESEND_API_KEY || '').trim();
  const fromAddress = (process.env.RESEND_FROM || '').trim();
  return Boolean(apiKey && fromAddress);
}

export async function verifySmtpConfiguration() {
  if (isResendConfigured()) {
    console.log('[AE-SIMULATORS EMAIL SERVICE] Resend HTTPS API configured for production email delivery.');
    return true;
  }

  const transporter = createTransporter();
  if (!transporter) {
    console.log('[AE-SIMULATORS EMAIL SERVICE] Email configuration missing. Set RESEND_API_KEY & RESEND_FROM for Resend, or SMTP_HOST, SMTP_USER, SMTP_PASS in .env to enable email delivery.');
    return false;
  }
  try {
    await transporter.verify();
    console.log('[AE-SIMULATORS EMAIL SERVICE] SMTP configuration verified successfully.');
    return true;
  } catch (err) {
    console.error(`[AE-SIMULATORS EMAIL SERVICE] SMTP verification failed: ${err.message}`);
    return false;
  }
}

export async function sendOtpEmail({ email, otp }) {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.SMTP_FROM || `"AE Simulators Verification" <${RECEIVER_EMAIL}>`,
    to: email,
    subject: 'AE-SIMULATORS — Email Verification Code',
    text: `Hello,

Your AE-SIMULATORS verification code is:

${otp}

This code expires in 10 minutes.

If you did not request this verification, you can ignore this email.

Regards,
AE-SIMULATORS
DRIVE REAL. TRAIN BETTER.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; background-color: #111115; color: #ffffff; padding: 25px; border-radius: 8px; border: 1px solid #22222a;">
        <div style="text-align: center; padding-bottom: 15px; border-bottom: 2px solid #E31B23;">
          <h2 style="color: #E31B23; margin: 0; font-size: 22px;">AE SIMULATORS</h2>
          <p style="color: #a1a1aa; margin: 4px 0 0 0; font-size: 11px; text-transform: uppercase; font-family: monospace;">EMAIL VERIFICATION SERVICE</p>
        </div>
        <div style="padding: 25px 0; text-align: center;">
          <p style="color: #d4d4d8; font-size: 15px; margin-bottom: 20px;">Your AE-SIMULATORS email verification code is:</p>
          <div style="background-color: #1a1a22; border: 1px solid #E31B23; color: #E31B23; font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 6px; padding: 15px 25px; display: inline-block; border-radius: 6px;">
            ${otp}
          </div>
          <p style="color: #71717a; font-size: 12px; margin-top: 20px;">This verification code expires in 10 minutes and is single-use.</p>
        </div>
        <div style="border-top: 1px solid #22222a; padding-top: 15px; text-align: center; color: #71717a; font-size: 11px; font-family: monospace;">
          AE-SIMULATORS &bull; DRIVE REAL. TRAIN BETTER.
        </div>
      </div>
    `,
  };

  if (transporter) {
    try {
      await transporter.sendMail(mailOptions);
      console.log(`[OTP] Email provider accepted message for ${email}`);
      return { success: true, message: 'Verification code sent to your email. Please check your inbox.' };
    } catch (err) {
      console.error(`[OTP ERROR] Email provider rejected message: ${err.message}`);
      return {
        success: false,
        error: 'EMAIL_SEND_FAILED',
        message: 'Unable to send the email verification code. Please check your email address or SMTP configuration.',
      };
    }
  } else {
    // If SMTP missing, check development mode
    if (process.env.OTP_MODE === 'development') {
      console.log(`\n==================================================`);
      console.log(`[DEV OTP] Email: ${otp} (${email})`);
      console.log(`==================================================\n`);
      return {
        success: true,
        message: 'Verification code sent to your email (Dev mode log in server console).',
      };
    } else {
      console.error('[OTP ERROR] Email provider not configured in production mode.');
      return {
        success: false,
        error: 'EMAIL_PROVIDER_NOT_CONFIGURED',
        message: 'Email verification is not configured on the server. Please contact AE-SIMULATORS.',
      };
    }
  }
}

export async function sendApplicationEmail({ fullName, phone, email, jobRole, additionalInfo, file }) {
  const tempFilePath = file ? file.path : null;

  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.SMTP_FROM || `"AE Simulators Careers" <${RECEIVER_EMAIL}>`,
      to: RECEIVER_EMAIL,
      subject: `NEW CAREER APPLICATION — ${fullName}`,
      text: `NEW CAREER APPLICATION — ${fullName}

Applicant Name: ${fullName}
Phone: ${phone}
Email: ${email}
Position: ${jobRole}
Additional Information: ${additionalInfo || 'N/A'}

Phone Verification: Verified ✓
Email Verification: Verified ✓

Submitted at: ${new Date().toUTCString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #111115; color: #ffffff; padding: 30px; border-radius: 8px; border: 1px solid #22222a;">
          <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #E31B23;">
            <h2 style="color: #E31B23; margin: 0; font-size: 24px; letter-spacing: 1px;">AE SIMULATORS</h2>
            <p style="color: #a1a1aa; margin: 5px 0 0 0; font-size: 12px; text-transform: uppercase; font-family: monospace;">CAREERS APPLICATION SYSTEM</p>
          </div>

          <div style="padding: 20px 0;">
            <h3 style="color: #ffffff; margin-top: 0; border-bottom: 1px solid #33333f; padding-bottom: 8px;">APPLICANT DETAILS</h3>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px 0; color: #a1a1aa; width: 35%;">Applicant Name:</td>
                <td style="padding: 8px 0; color: #ffffff; font-weight: bold;">${fullName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #a1a1aa;">Phone:</td>
                <td style="padding: 8px 0; color: #ffffff; font-weight: bold;">${phone} (Verified &#10003;)</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #a1a1aa;">Email:</td>
                <td style="padding: 8px 0; color: #ffffff; font-weight: bold;">${email} (Verified &#10003;)</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #a1a1aa;">Position:</td>
                <td style="padding: 8px 0; color: #E31B23; font-weight: bold;">${jobRole}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #a1a1aa;">Additional Information:</td>
                <td style="padding: 8px 0; color: #d4d4d8;">${additionalInfo || 'N/A'}</td>
              </tr>
            </table>

            <div style="background-color: #1a1a22; padding: 15px; border-radius: 6px; border-left: 4px solid #E31B23; margin-top: 15px;">
              <p style="margin: 0; color: #a1a1aa; font-size: 13px;">
                <strong>Attached Resume:</strong> ${file ? file.originalname : 'Attached'} (${file ? (file.size / (1024 * 1024)).toFixed(2) : 0} MB)
              </p>
            </div>
          </div>

          <div style="border-top: 1px solid #22222a; padding-top: 15px; text-align: center; color: #71717a; font-size: 11px; font-family: monospace;">
            AE Simulators &bull; Official Careers Application System &bull; Destination: aesimulators@outlook.com
          </div>
        </div>
      `,
      attachments: file
        ? [
            {
              filename: file.originalname,
              path: tempFilePath,
            },
          ]
        : [],
    };

    if (transporter) {
      await transporter.sendMail(mailOptions);
      console.log(`[EMAIL SERVICE] Careers application email sent to ${RECEIVER_EMAIL} for ${fullName}`);
    } else {
      console.log(`[EMAIL SERVICE DEV MODE] Application received for ${fullName} (${email}). Logged in server console.`);
    }

    return { success: true, message: 'Application submitted successfully.' };
  } catch (err) {
    console.error('[EMAIL SERVICE ERROR]', err);
    throw err;
  } finally {
    // ALWAYS UNLINK / DELETE TEMPORARY FILE AFTER TRANSMISSION
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
        console.log(`[SECURE CLEANUP] Temporary resume file deleted from server disk: ${tempFilePath}`);
      } catch (unlinkErr) {
        console.error('[SECURE CLEANUP ERROR] Failed to unlink temp file:', unlinkErr);
      }
    }
  }
}

export async function sendContactEmail({ name, company, email, phone, requirement, message }) {
  const recipient = process.env.ENQUIRY_RECIPIENT_EMAIL || 'aesimulators@outlook.com';

  // Sanitize header inputs to prevent CRLF email header injection
  const safeName = String(name || '').replace(/[\r\n]/g, '').trim();
  const safeEmail = String(email || '').replace(/[\r\n]/g, '').trim().toLowerCase();
  const safeCompany = String(company || '').replace(/[\r\n]/g, '').trim();
  const safePhone = String(phone || '').replace(/[\r\n]/g, '').trim();
  const safeRequirement = String(requirement || 'General Enquiry').replace(/[\r\n]/g, '').trim();
  const safeMessage = String(message || '').trim();

  const textContent = `New enquiry received from the AE-SIMULATORS website.

Name:
${safeName}

Email:
${safeEmail}

Phone:
${safePhone || 'N/A'}

Company:
${safeCompany || 'N/A'}

Requirement / Subject:
${safeRequirement}

Message:
${safeMessage}

Submitted at: ${new Date().toUTCString()}`;

  const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #111115; color: #ffffff; padding: 30px; border-radius: 8px; border: 1px solid #22222a;">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #E31B23;">
          <h2 style="color: #E31B23; margin: 0; font-size: 24px; letter-spacing: 1px;">AE SIMULATORS</h2>
          <p style="color: #a1a1aa; margin: 5px 0 0 0; font-size: 12px; text-transform: uppercase; font-family: monospace;">NEW WEBSITE ENQUIRY</p>
        </div>

        <div style="padding: 20px 0;">
          <p style="color: #d4d4d8; font-size: 15px; margin-bottom: 20px;">New enquiry received from the AE-SIMULATORS website.</p>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; color: #a1a1aa; width: 30%;">Name:</td>
              <td style="padding: 8px 0; color: #ffffff; font-weight: bold;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #a1a1aa;">Email:</td>
              <td style="padding: 8px 0; color: #E31B23; font-weight: bold;">${safeEmail}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #a1a1aa;">Phone:</td>
              <td style="padding: 8px 0; color: #ffffff;">${safePhone || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #a1a1aa;">Company:</td>
              <td style="padding: 8px 0; color: #ffffff;">${safeCompany || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #a1a1aa;">Requirement / Subject:</td>
              <td style="padding: 8px 0; color: #ffffff; font-weight: bold;">${safeRequirement}</td>
            </tr>
          </table>

          <div style="background-color: #1a1a22; padding: 18px; border-radius: 6px; border-left: 4px solid #E31B23; margin-top: 15px;">
            <p style="margin: 0 0 8px 0; color: #a1a1aa; font-size: 12px; font-weight: bold; text-transform: uppercase;">Message:</p>
            <p style="margin: 0; color: #ffffff; font-size: 14px; white-space: pre-wrap; line-height: 1.6;">${safeMessage}</p>
          </div>
        </div>

        <div style="border-top: 1px solid #22222a; padding-top: 15px; text-align: center; color: #71717a; font-size: 11px; font-family: monospace;">
          AE Simulators &bull; Official Enquiry System &bull; Destination: ${recipient}
        </div>
      </div>
    `;

  // 1. Resend HTTPS API Transport (Requires BOTH RESEND_API_KEY and RESEND_FROM)
  if (isResendConfigured()) {
    const apiKey = process.env.RESEND_API_KEY.trim();
    const fromAddress = process.env.RESEND_FROM.trim();
    try {
      const resend = new Resend(apiKey);
      const { data, error } = await resend.emails.send({
        from: fromAddress,
        to: recipient,
        replyTo: safeEmail,
        subject: `New Website Enquiry — AE-SIMULATORS`,
        text: textContent,
        html: htmlContent,
      });

      if (error) {
        console.error(`[CONTACT EMAIL ERROR] Resend API error: ${error.message || JSON.stringify(error)}`);
        return {
          success: false,
          error: 'EMAIL_SEND_FAILED',
          message: "Sorry, we couldn't send your enquiry right now. Please check server email credentials or try again in a few moments.",
        };
      }

      console.log(`[CONTACT EMAIL SUCCESS] Enquiry email delivered via Resend HTTPS API to ${recipient} (ID: ${data?.id})`);
      return {
        success: true,
        message: 'Thank you for your enquiry. Your message has been sent successfully. Our team will get back to you shortly.',
      };
    } catch (err) {
      console.error(`[CONTACT EMAIL ERROR] Resend transmission failed: ${err.message}`);
      return {
        success: false,
        error: 'EMAIL_SEND_FAILED',
        message: "Sorry, we couldn't send your enquiry right now. Please check server email credentials or try again in a few moments.",
      };
    }
  }

  // 2. Nodemailer Gmail SMTP Transport Fallback
  const transporter = createTransporter();
  const senderAddress = process.env.SMTP_FROM || process.env.SMTP_USER || `"AE Simulators Website" <${recipient}>`;

  const mailOptions = {
    from: senderAddress,
    to: recipient,
    replyTo: safeEmail,
    subject: `New Website Enquiry — AE-SIMULATORS`,
    text: textContent,
    html: htmlContent,
  };

  if (!transporter) {
    console.error('[CONTACT EMAIL ERROR] Neither Resend (RESEND_API_KEY + RESEND_FROM) nor SMTP configuration is present in .env.');
    return {
      success: false,
      error: 'SMTP_NOT_CONFIGURED',
      message: 'Server email credentials are not configured. Please set RESEND_API_KEY and RESEND_FROM (or SMTP credentials) in .env.',
    };
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[CONTACT EMAIL SUCCESS] Enquiry email delivered to ${recipient} (Message ID: ${info.messageId})`);
    return {
      success: true,
      message: 'Thank you for your enquiry. Your message has been sent successfully. Our team will get back to you shortly.',
    };
  } catch (err) {
    console.error(`[CONTACT EMAIL ERROR] Failed to send email via SMTP: ${err.message}`);
    return {
      success: false,
      error: 'EMAIL_SEND_FAILED',
      message: "Sorry, we couldn't send your enquiry right now. Please check server email credentials or try again in a few moments.",
    };
  }
}

