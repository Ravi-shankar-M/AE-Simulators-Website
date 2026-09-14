import React, { useRef } from 'react';
import useParallax from '../utils/useParallax';

export default function ParallaxLayer({
  children,
  speed = 0.2,
  direction = 'vertical',
  mobile = false,
  className = '',
  style = {},
  as: Component = 'div',
  ...props
}) {
  const layerRef = useRef(null);

  useParallax(layerRef, { speed, direction, mobile });

  return (
    <Component
      ref={layerRef}
      className={`parallax-layer ${className}`}
      style={{ willChange: 'transform', ...style }}
      {...props}
    >
      {children}
    </Component>
  );
}
