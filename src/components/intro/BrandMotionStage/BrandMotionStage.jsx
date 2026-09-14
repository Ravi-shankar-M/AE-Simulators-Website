import React, { useState, useEffect, useRef } from 'react';
import { BRANDMOTION_STATES, createBrandMotionTimeline } from '../../../animations/brandMotionTimeline';
import { ASSETS } from '../../../data/assets';
import SmallFormulaCar from '../../brandmotion/SmallFormulaCar';
import OxaniumWordmark from '../../brandmotion/OxaniumWordmark';
import BrandTagline from '../../brandmotion/BrandTagline';
import './BrandMotionStage.css';

export default function BrandMotionStage({ onFinished }) {
  const [currentState, setCurrentState] = useState(BRANDMOTION_STATES.SCENE_1_LOGO_INIT);
  const onFinishedRef = useRef(onFinished);

  useEffect(() => {
    onFinishedRef.current = onFinished;
  }, [onFinished]);

  useEffect(() => {
    console.log('AE ARRIVAL INTRO STARTED — THE BRAND AS HERO');

    const timeline = createBrandMotionTimeline({
      onStateChange: (state) => {
        setCurrentState(state);
      },
      onComplete: () => {
        console.log('AE ARRIVAL INTRO COMPLETED — THE BRAND AS HERO');
        if (onFinishedRef.current) {
          onFinishedRef.current();
        }
      },
      onSoundHook: (hook) => {
        console.log(`[THE BRAND AS HERO SFX HOOK]: ${hook}`);
      },
    });

    const stopTimeline = timeline.start();
    return () => stopTimeline();
  }, []);

  const isTrajectoryActive = [
    BRANDMOTION_STATES.SCENE_2_LIGHT_SWEEP,
    BRANDMOTION_STATES.SCENE_3_CAR_DRIVE,
    BRANDMOTION_STATES.SCENE_4_CAR_EXIT,
  ].includes(currentState);

  const isTrajectoryBrightened = currentState === BRANDMOTION_STATES.SCENE_3_CAR_DRIVE;

  const isSmallCarActive = [
    BRANDMOTION_STATES.SCENE_2_LIGHT_SWEEP,
    BRANDMOTION_STATES.SCENE_3_CAR_DRIVE,
    BRANDMOTION_STATES.SCENE_4_CAR_EXIT,
  ].includes(currentState);

  const isWordmarkActive = [
    BRANDMOTION_STATES.SCENE_2_LIGHT_SWEEP,
    BRANDMOTION_STATES.SCENE_3_CAR_DRIVE,
    BRANDMOTION_STATES.SCENE_4_CAR_EXIT,
    BRANDMOTION_STATES.SCENE_5_FINAL_BRAND,
    BRANDMOTION_STATES.SCENE_6_EXPAND_TRANSITION,
  ].includes(currentState);

  const isTaglineActive = [
    BRANDMOTION_STATES.SCENE_5_FINAL_BRAND,
    BRANDMOTION_STATES.SCENE_6_EXPAND_TRANSITION,
  ].includes(currentState);

  const isExpanded = currentState === BRANDMOTION_STATES.SCENE_6_EXPAND_TRANSITION;

  return (
    <div className="brandmotion-stage-wrapper">
      {/* BOUNDED CINEMATIC STAGE RECTANGLE */}
      <div className={`brandmotion-stage-box ${isExpanded ? 'expanded' : ''}`}>
        {/* Clean Stable AE Simulators Logo (Size and Position Unchanged) */}
        <div className="brandmotion-logo-layer">
          <img
            src={ASSETS.logo.official}
            alt="AE Simulators Official Logo"
            className="brandmotion-brand-img"
          />
        </div>

        {/* Primary Oxanium Metallic AE-SIMULATORS Wordmark */}
        <OxaniumWordmark active={isWordmarkActive} />

        {/* Thin Horizontal Trajectory Motion Line */}
        <div className={`motion-trajectory-line ${isTrajectoryActive ? 'active' : ''} ${isTrajectoryBrightened ? 'brightened' : ''}`}>
          <div className="trajectory-bright-center" />
        </div>

        {/* Small Sleek Formula Vehicle Driving RIGHT -> LEFT (15-25% Stage Width) */}
        <SmallFormulaCar active={isSmallCarActive} />

        {/* Space Grotesk White Tagline Reveal ("DRIVE REAL. TRAIN BETTER.") */}
        <BrandTagline active={isTaglineActive} />
      </div>
    </div>
  );
}
