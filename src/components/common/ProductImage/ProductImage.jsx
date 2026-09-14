import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';
import ProtectedImage from './common/ProtectedImage';
import './ProductImage.css';

export default function ProductImage({
  src,
  alt = 'AE-SIMULATORS Product Hardware Asset',
  className = '',
  aspectRatio = 'auto',
  objectFit = 'cover',
  objectPosition = 'center',
  overlay = false,
  loading = 'lazy',
  isHero = false
}) {
  const [error, setError] = useState(!src);

  const handleError = () => {
    setError(true);
  };

  if (error || !src) {
    if (isHero) {
      return (
        <div
          className={`product-image-hero-fallback ${className}`}
          style={{ aspectRatio }}
          aria-label={alt}
        >
          <div className="hero-fallback-grid" />
        </div>
      );
    }

    return (
      <div
        className={`product-image-fallback-container font-mono ${className}`}
        style={{ aspectRatio }}
        aria-label={alt}
      >
        <ImageOff size={24} className="fallback-icon text-ae-red" />
        <span className="fallback-text">[IMAGE TO BE PROVIDED]</span>
        <span className="fallback-sub text-dim">OFFICIAL AE ASSET PENDING</span>
      </div>
    );
  }

  return (
    <div className={`product-image-wrapper ${className}`} style={{ aspectRatio }}>
      <ProtectedImage
        src={src}
        alt={alt}
        loading={loading}
        onError={handleError}
        style={{ objectFit, objectPosition }}
        className="product-img-element"
      />
      {overlay && <div className="product-img-overlay" />}
    </div>
  );
}

