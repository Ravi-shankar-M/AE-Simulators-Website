import React from 'react';
import { CONTACT_CONFIG } from '../../config/contact';
import './WhatsAppWidget.css';

const WHATSAPP_NUMBER = (CONTACT_CONFIG.WHATSAPP_NUMBER || '+919345764379').replace(/[^0-9]/g, '');

const EXACT_PREFILLED_MESSAGE = "Hi AE SIMULATORS ! I came across your driving simulators solutions and would love to know more about what you offer and how they could fit our needs";

export default function WhatsAppWidget() {
  const handleWhatsAppRedirect = (e) => {
    e.preventDefault();
    const encodedMessage = encodeURIComponent(EXACT_PREFILLED_MESSAGE);
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="whatsapp-widget-container font-body">
      {/* ── FLOATING GREEN WHATSAPP BUTTON (DIRECT REDIRECT ONLY) ── */}
      <div className="whatsapp-fab-wrapper">
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(EXACT_PREFILLED_MESSAGE)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-fab-button"
          onClick={handleWhatsAppRedirect}
          aria-label="Contact AE SIMULATORS on WhatsApp"
        >
          <svg className="wa-fab-svg" viewBox="0 0 32 32" fill="currentColor">
            <path d="M16 0C7.163 0 0 7.163 0 16c0 2.824.737 5.479 2.027 7.789L0 32l8.438-2.012A15.94 15.94 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm8.24 22.383c-.34.958-1.997 1.828-2.744 1.945-.7.11-1.583.156-2.554-.16-.589-.192-1.344-.447-2.31-.875-4.064-1.757-6.715-5.84-6.916-6.113-.2-.272-1.638-2.179-1.638-4.157 0-1.978 1.038-2.953 1.407-3.353.369-.4.804-.5 1.072-.5.267 0 .535.003.768.013.247.012.577-.093.905.691.34.813 1.154 2.81 1.257 3.012.103.202.17.437.033.709-.136.27-.203.44-.405.676-.202.238-.425.53-.607.711-.202.202-.412.42-.177.822.235.4 1.045 1.726 2.244 2.795 1.543 1.374 2.843 1.8 3.243 2.002.4.202.634.169.87-.101.235-.27 1.008-1.175 1.278-1.578.27-.403.54-.336.91-.202.37.134 2.352 1.11 2.755 1.311.403.202.672.302.771.47.1.167.1.968-.24 1.927z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
