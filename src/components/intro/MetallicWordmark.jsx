import React from 'react';

export default function MetallicWordmark({ active }) {
  return (
    <div className={`metallic-wordmark-container ${active ? 'active' : ''}`}>
      <h2 className="metallic-title-text">AE-SIMULATORS</h2>
    </div>
  );
}
