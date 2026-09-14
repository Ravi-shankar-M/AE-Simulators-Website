import React from 'react';
import { STAGE_STATES } from '../animations/arrivalTimeline';
import GroundParticles from './GroundParticles';

export default function DraggedTitle({ state }) {
  const isDragging = [
    STAGE_STATES.TITLE_DRAG_START,
    STAGE_STATES.CAR_PULL_BOOST,
    STAGE_STATES.MAX_ACCELERATION,
  ].includes(state);

  return (
    <div className="dragged-title-wrapper">
      {/* Ground Contact Friction Sparks & Dust Particles */}
      {isDragging && <GroundParticles />}

      {/* 3D Metallic Silver Business Title (Grounded on floor) */}
      <div className="dragged-title-3d">AE-SIMULATORS</div>
    </div>
  );
}
