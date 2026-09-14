/**
 * useParallax — GSAP ScrollTrigger Hook for AE-SIMULATORS
 *
 * Provides smooth, subtle, scroll-linked parallax depth.
 * Respects `prefers-reduced-motion` and disables/reduces intensity on mobile devices.
 * Automatically cleans up GSAP context on component unmount.
 *
 * Speeds:
 *  0.1      → background elements
 *  0.2–0.4  → visual imagery / product cards
 *  0.4–0.6  → foreground decorative accents
 */

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function useParallax(targetRef, options = {}) {
  const {
    speed = 0.2,
    direction = 'vertical', // 'vertical' | 'horizontal'
    mobile = false,
  } = options;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Accessibility: check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Mobile performance check
    const isMobile = window.innerWidth <= 768;
    if (isMobile && !mobile) return;

    const element = targetRef?.current;
    if (!element) return;

    const effectiveSpeed = isMobile ? speed * 0.4 : speed;
    const yShift = effectiveSpeed * 100;

    const ctx = gsap.context(() => {
      if (direction === 'horizontal') {
        gsap.to(element, {
          x: (i, target) => (effectiveSpeed * 60),
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      } else {
        gsap.fromTo(
          element,
          { y: -yShift },
          {
            y: yShift,
            ease: 'none',
            scrollTrigger: {
              trigger: element,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
              invalidateOnRefresh: true,
            },
          }
        );
      }
    });

    return () => {
      ctx.revert();
    };
  }, [targetRef, speed, direction, mobile]);
}
