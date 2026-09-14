import React from 'react';
import DirectContact from './DirectContact/DirectContact';
import ContactForm from './ContactForm/ContactForm';

import './Contact.css';

export default function Contact() {
  return (
    <div className="contact-page-container">
      <DirectContact />
      <ContactForm />
    </div>
  );
}
