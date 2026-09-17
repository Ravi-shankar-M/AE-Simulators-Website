# AE SIMULATORS Design System

This document defines the visual system for the AE SIMULATORS website upgrade. The aesthetic is strictly focused on **Automotive Engineering + Industrial Technology + Precision Motion**.

## 1. Core Visual Direction
- **Vibe:** Mechanical sophistication, professional engineering, high-performance simulation.
- **Feel:** Premium, reliable, clean, and highly technical but accessible.
- **What to Avoid:** AI-generated gradients, glassmorphism blobs, generic SaaS cards, overly playful hover effects, cyberpunk neon, neon purple gradients.

## 2. Color Palette
The color palette should reflect raw materials (steel, aluminum, rubber) with sharp technical accents.

- **Primary Brand Red:** `#E31B23` (AE Official Red) - Used exclusively for primary actions, active states, and critical motion accents.
- **Backgrounds:** 
  - `Base Dark:` `#09090b` (Deepest charcoal/black for premium dark mode sections)
  - `Panel Dark:` `#111622` (Slightly elevated dark for cards/controls)
  - `Base Light:` `#ffffff` (For technical light mode sections, blueprints, or documents)
  - `Panel Light:` `#f4f4f5` or `#f8f8f9`
- **Text:**
  - `Primary:` `#ffffff` (Dark mode) or `#09090b` (Light mode)
  - `Secondary:` `#94A3B8` (Dark mode) or `#52525b` (Light mode)
- **Borders & Lines:** `#1E2638` (Dark mode) or `#e4e4e7` (Light mode)

## 3. Typography
- **Headings (Brand & Technical):** Needs to be sharp, angular, and heavy. Uppercase preferred for major section headers.
- **Body Text:** Highly readable, geometric sans-serif. Keep line-height generous (1.6) for readability.
- **Technical Readouts / UI Controls:** Monospace fonts (e.g., *JetBrains Mono*, *Roboto Mono*) for numbers, sliders, coordinates, and axes values.

## 4. Spacing & Rhythm
- Establish a strict vertical rhythm. 
- Avoid tight, cramped sections. Give 3D models and large images "room to breathe".
- **Gaps:** Use multiples of `8px` (`8px`, `16px`, `24px`, `32px`, `64px`, `96px`).
- **Section Padding:** Minimum `padding-top/bottom: 5rem` on desktop for major sections.

## 5. UI Elements
- **Buttons:** Sharp or slightly rounded corners (not fully pill-shaped). High contrast. Hover states should feel like mechanical switches engaging (crisp color swaps or borders), not soft glowing fades.
- **Cards:** Minimal borders (`1px solid #1E2638`), dark backgrounds, no excessive drop shadows. If shadows are used, they must be sharp and subtle, indicating mechanical elevation rather than floating.
- **Technical Accents:** Use thin lines, crosshairs, axis labels (X, Y, Z), or subtle grid backgrounds in specific kinematics/engineering sections. 

## 6. Image & 3D Treatment
- **Images:** High contrast, slightly desaturated backgrounds to make the product pop. Sharp masking. 
- **3D / GLB Models:** Realistic materials (powder-coated metal, brushed steel, anodized aluminum). Avoid cartoon shaders. 
- **Integrations:** Viewers should feel like embedded engineering CAD tools, not video games.

## 7. Motion & Animation
- **Pacing:** Precise, mechanical, controlled.
- **Easing:** Cubic-bezier curves that start fast and snap into place (e.g., `cubic-bezier(0.25, 1, 0.5, 1)`), mimicking servo motors and actuators.
- **Avoid:** Bouncy physics, continuous floating/bobbing (unless simulating heave/pitch), or distracting particle effects.

## 8. Specific Brand Rules
- **Tagline:** "DRIVE REAL. TRAIN BETTER." applies **only** to Training/Driving Simulation contexts. Do not use for generic motion engineering.
- **Parent Company:** AE AUTOMATION ENGINEERS must be clearly identified in the **About Us** section.
- **3-DOF & 6-DOF:** Must be presented with technical clarity.
