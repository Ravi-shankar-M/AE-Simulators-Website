import { useState, useEffect, useRef } from 'react';

export function useIntersectionObserver(options = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (options.once !== false) {
          if (elementRef.current) observer.unobserve(elementRef.current);
        }
      } else if (options.once === false) {
        setIsVisible(false);
      }
    }, { threshold: options.threshold || 0.15, ...options });

    const currentElem = elementRef.current;
    if (currentElem) observer.observe(currentElem);

    return () => {
      if (currentElem) observer.unobserve(currentElem);
    };
  }, [options]);

  return [elementRef, isVisible];
}
