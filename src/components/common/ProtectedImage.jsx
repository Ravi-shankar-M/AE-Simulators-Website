/**
 * ProtectedImage — Reusable image component with casual-download protection.
 *
 * Protections applied:
 *  - draggable="false"         → prevents drag-and-drop saving
 *  - onContextMenu prevention  → disables right-click "Save image as…"
 *  - onDragStart prevention    → belt-and-suspenders drag block
 *  - CSS user-select: none     → prevents text-adjacent selection artifacts
 *
 * NOTE: A browser-delivered image can never be made completely inaccessible
 * to a determined user. This component provides practical protection against
 * casual, accidental downloading — not cryptographic security.
 *
 * Accessibility: alt, role, aria-label are fully forwarded. Does NOT add
 * pointer-events:none so keyboard/screen-reader access is unaffected.
 */

import React from 'react';

/**
 * @param {string}  src       - Image source URL (required)
 * @param {string}  alt       - Descriptive alt text (required for a11y)
 * @param {string}  [className] - Additional CSS class names
 * @param {object}  [style]   - Inline style overrides
 * @param {string}  [id]      - Optional element ID
 * @param {...*}    rest      - Any other valid <img> props are forwarded
 */
export default function ProtectedImage({ src, alt, className, style, id, ...rest }) {
  const handleContextMenu = (e) => {
    e.preventDefault();
    return false;
  };

  const handleDragStart = (e) => {
    e.preventDefault();
    return false;
  };

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        WebkitUserDrag: 'none',
        ...style,
      }}
      id={id}
      draggable={false}
      onContextMenu={handleContextMenu}
      onDragStart={handleDragStart}
      {...rest}
    />
  );
}
