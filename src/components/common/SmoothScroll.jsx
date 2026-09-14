import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SmoothScroll({ children }) {
  useEffect(() => {
    let lenis = null;
    let updateTicker = null;

    // Dynamically load Lenis for smooth momentum scrolling site-wide
    import('lenis')
      .then(({ default: Lenis }) => {
        lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          direction: 'vertical',
          gestureDirection: 'vertical',
          smoothTouch: false,
          touchMultiplier: 2,
        });

        // Synchronize Lenis scroll position directly with GSAP ScrollTrigger
        lenis.on('scroll', () => {
          ScrollTrigger.update();
        });

        updateTicker = (time) => {
          lenis.raf(time * 1000);
        };

        gsap.ticker.add(updateTicker);
        gsap.ticker.lagSmoothing(0);
      })
      .catch(() => {
        // Fallback: native smooth scroll
        document.documentElement.style.scrollBehavior = 'smooth';
      });

    return () => {
      if (updateTicker) {
        gsap.ticker.remove(updateTicker);
      }
      if (lenis) {
        lenis.destroy();
      }
    };
  }, []);

  return <>{children}</>;
}
