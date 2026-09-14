import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * ParallaxLayer — Reusable GSAP ScrollTrigger Parallax Wrapper.
 *
 * - speed: multiplier for parallax movement (e.g. -50 for slow background, +40 for foreground)
 * - direction: 'vertical' | 'horizontal'
 * - scrub: true | number (scrub smoothing)
 */
export default function ParallaxLayer({
  children,
  speed = -40, // Pixel shift over scroll range
  direction = 'vertical',
  scrub = 1,
  className = '',
  style = {},
}) {
  const layerRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !layerRef.current) return;

    const el = layerRef.current;

    const ctx = gsap.context(() => {
      const animProps = direction === 'horizontal' ? { x: speed } : { y: speed };
      gsap.to(el, {
        ...animProps,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: scrub,
          invalidateOnRefresh: true,
        },
      });
    }, layerRef);

    return () => {
      ctx.revert();
    };
  }, [speed, direction, scrub]);

  return (
    <div ref={layerRef} className={`parallax-layer-wrapper ${className}`} style={{ ...style, willChange: 'transform' }}>
      {children}
    </div>
  );
}
