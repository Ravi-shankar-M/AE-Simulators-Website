/**
 * Centralized Contact Configuration for AE-SIMULATORS Website
 * Parent Company: AE Simulators
 *
 * ─────────────────────────────────────────────────────────────
 * UPDATE THIS FILE to change contact details site-wide.
 * Do NOT hard-code these values in individual components.
 * ─────────────────────────────────────────────────────────────
 */

export const CONTACT_CONFIG = {
  /**
   * WhatsApp business number in international format (no spaces, no dashes).
   * Example: '+919876543210'
   */
  WHATSAPP_NUMBER: '+919345764379',

  /**
   * Official company enquiry / contact email addresses.
   */
  OFFICIAL_EMAIL: 'aesimulators@outlook.com',
  SUPPORT_EMAIL: 'support@aesimulators.com',
  ENQUIRY_EMAIL: 'enquiry@aesimulators.com',

  /**
   * Company headquarters / engineering location.
   */
  LOCATION: 'India',

  MOBILE_NUMBER: '9945552222',

  REGISTERED_ADDRESSES: [
    'Silk Board, Bangalore.',
    'Navi Mumbai, Maharashtra.',
    'Coimbatore, Tamilnadu.'
  ],
  ADDRESS_LINES: [
    'Silk Board, Bangalore.',
    'Navi Mumbai, Maharashtra.',
    'Coimbatore, Tamilnadu.'
  ],
  FULL_ADDRESS: 'Silk Board, Bangalore. Navi Mumbai, Maharashtra. Coimbatore, Tamilnadu.',

  /**
   * Maximum allowed resume upload size in bytes.
   * Requirement: Within 2 MB = 2 * 1024 * 1024
   */
  RESUME_MAX_SIZE_BYTES: 2 * 1024 * 1024,
};

export default CONTACT_CONFIG;
