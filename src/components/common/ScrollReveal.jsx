import React, { useEffect, useRef, useState } from 'react';
import './ScrollReveal.css';

export default function ScrollReveal({
  children,
  variant = 'fade-up', // 'fade-up' | 'fade-in' | 'scale-up' | 'slide-right' | 'stagger'
  delay = 0,
  duration = 600, // ms
  className = '',
  style = {},
  once = false,
}) {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setIsVisible(true);
      return;
    }

    const target = elementRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [once]);

  const customStyle = {
    ...style,
    transitionDuration: `${duration}ms`,
    transitionDelay: `${delay}s`,
  };

  return (
    <div
      ref={elementRef}
      className={`sr-reveal-box sr-${variant} ${isVisible ? 'sr-visible' : ''} ${className}`}
      style={customStyle}
    >
      {children}
    </div>
  );
}
