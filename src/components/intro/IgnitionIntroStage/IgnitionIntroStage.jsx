import React, { useState, useEffect, useRef } from 'react';
import { IGNITION_STATES, createIgnitionTimeline } from '../../../animations/ignitionTimeline';
import IgnitionLogo from '../../ignition/IgnitionLogo';
import IgnitionFormulaCar from '../../ignition/IgnitionFormulaCar';
import IgnitionWordmark from '../../ignition/IgnitionWordmark';
import IgnitionTagline from '../../ignition/IgnitionTagline';
import './IgnitionIntroStage.css';

export default function IgnitionIntroStage({ onFinished }) {
  const [currentState, setCurrentState] = useState(IGNITION_STATES.SCENE_1_LOGO);
  const onFinishedRef = useRef(onFinished);

  useEffect(() => {
    onFinishedRef.current = onFinished;
  }, [onFinished]);

  useEffect(() => {
    console.log('AE ARRIVAL INTRO STARTED — THE IGNITION');

    const timeline = createIgnitionTimeline({
      onStateChange: (state) => {
        setCurrentState(state);
      },
      onComplete: () => {
        console.log('AE ARRIVAL INTRO COMPLETED — THE IGNITION');
        if (onFinishedRef.current) {
          onFinishedRef.current();
        }
      },
      onSoundHook: (hook) => {
        // Prepared sound architecture hooks
        console.log(`[THE IGNITION SFX HOOK]: ${hook}`);
      },
    });

    const stopTimeline = timeline.start();
    return () => stopTimeline();
  }, []);

  const isRedSweepActive = currentState === IGNITION_STATES.SCENE_1_LOGO;

  const isCarActive = currentState === IGNITION_STATES.SCENE_2_CAR_SWEEP;

  const showTrail = [
    IGNITION_STATES.SCENE_2_CAR_SWEEP,
    IGNITION_STATES.SCENE_3_WORDMARK_REVEAL,
    IGNITION_STATES.SCENE_4_BRAND_HOLD,
  ].includes(currentState);

  const isWordmarkActive = [
    IGNITION_STATES.SCENE_3_WORDMARK_REVEAL,
    IGNITION_STATES.SCENE_4_BRAND_HOLD,
    IGNITION_STATES.SCENE_5_TAGLINE_REVEAL,
    IGNITION_STATES.SCENE_6_HOMEPAGE_TRANSITION,
  ].includes(currentState);

  const isTaglineActive = [
    IGNITION_STATES.SCENE_5_TAGLINE_REVEAL,
    IGNITION_STATES.SCENE_6_HOMEPAGE_TRANSITION,
  ].includes(currentState);

  const isExpanded = currentState === IGNITION_STATES.SCENE_6_HOMEPAGE_TRANSITION;

  return (
    <div className="ignition-stage-wrapper">
      {/* Background Red Glow */}
      <div className="ignition-bg-glow" />

      {/* BOUNDED CINEMATIC STAGE RECTANGLE */}
      <div className={`ignition-stage-box ${isExpanded ? 'expanded' : ''}`}>
        {/* Scene 1: Fixed Centered Logo & Red Sweep */}
        <IgnitionLogo
          active={isRedSweepActive}
          isDimmed={isWordmarkActive}
          isHidden={isTaglineActive}
        />

        {/* Scene 2: Formula Car Sweep (RIGHT -> LEFT) & Light Trail */}
        <IgnitionFormulaCar active={isCarActive} showTrail={showTrail} />

        {/* Scene 3 & 4: Metallic AE-SIMULATORS Wordmark */}
        <IgnitionWordmark active={isWordmarkActive} />

        {/* Scene 5: Clean White Tagline Reveal */}
        <IgnitionTagline active={isTaglineActive} />
      </div>
    </div>
  );
}
