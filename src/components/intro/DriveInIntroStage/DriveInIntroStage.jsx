import React, { useState, useEffect, useRef } from 'react';
import { DRIVEIN_STATES, createDriveInTimeline } from '../../../animations/driveInTimeline';
import { ASSETS } from '../../../data/assets';
import DriveInVehicle from '../../drivein/DriveInVehicle';
import DriveInWordmark from '../../drivein/DriveInWordmark';
import DriveInTagline from '../../drivein/DriveInTagline';
import './DriveInIntroStage.css';

export default function DriveInIntroStage({ onFinished }) {
  const [currentState, setCurrentState] = useState(DRIVEIN_STATES.SCENE_1_DARK);
  const onFinishedRef = useRef(onFinished);

  useEffect(() => {
    onFinishedRef.current = onFinished;
  }, [onFinished]);

  useEffect(() => {
    console.log('AE ARRIVAL INTRO STARTED — THE DRIVE-IN');

    const timeline = createDriveInTimeline({
      onStateChange: (state) => {
        setCurrentState(state);
      },
      onComplete: () => {
        console.log('AE ARRIVAL INTRO COMPLETED — THE DRIVE-IN');
        if (onFinishedRef.current) {
          onFinishedRef.current();
        }
      },
      onSoundHook: (hook) => {
        console.log(`[THE DRIVE-IN SFX HOOK]: ${hook}`);
      },
    });

    const stopTimeline = timeline.start();
    return () => stopTimeline();
  }, []);

  const isVehicleActive = [
    DRIVEIN_STATES.SCENE_2_DISTANT_CAR,
    DRIVEIN_STATES.SCENE_3_APPROACH,
    DRIVEIN_STATES.SCENE_4_LARGE_FOREGROUND,
    DRIVEIN_STATES.SCENE_5_HERO_HOLD,
    DRIVEIN_STATES.SCENE_6_HIGH_SPEED_PASS,
  ].includes(currentState);

  const showTrail = [
    DRIVEIN_STATES.SCENE_6_HIGH_SPEED_PASS,
    DRIVEIN_STATES.SCENE_7_LIGHT_TRAIL,
    DRIVEIN_STATES.SCENE_8_WORDMARK_CONSTRUCT,
    DRIVEIN_STATES.SCENE_9_LIGHT_SWEEP,
  ].includes(currentState);

  const isWordmarkActive = [
    DRIVEIN_STATES.SCENE_8_WORDMARK_CONSTRUCT,
    DRIVEIN_STATES.SCENE_9_LIGHT_SWEEP,
    DRIVEIN_STATES.SCENE_10_TAGLINE,
    DRIVEIN_STATES.SCENE_11_BRAND_FRAME,
    DRIVEIN_STATES.SCENE_12_STAGE_EXPAND,
  ].includes(currentState);

  const isTaglineActive = [
    DRIVEIN_STATES.SCENE_10_TAGLINE,
    DRIVEIN_STATES.SCENE_11_BRAND_FRAME,
    DRIVEIN_STATES.SCENE_12_STAGE_EXPAND,
  ].includes(currentState);

  const isExpanded = currentState === DRIVEIN_STATES.SCENE_12_STAGE_EXPAND;

  return (
    <div className="drivein-stage-wrapper">
      {/* BOUNDED CINEMATIC STAGE RECTANGLE */}
      <div className={`drivein-stage-box ${isExpanded ? 'expanded' : ''}`}>
        {/* Dark Asphalt Studio Floor with Red Perspective Markers */}
        <div className="asphalt-studio-floor">
          <div className="perspective-lane-left" />
          <div className="perspective-lane-right" />
        </div>

        {/* Clean Stable AE Simulators Logo (Size and Position Unchanged) */}
        <div className={`drivein-logo-layer ${isWordmarkActive ? 'dimmed' : ''} ${isTaglineActive ? 'hidden' : ''}`}>
          <img
            src={ASSETS.logo.official}
            alt="AE Simulators Official Logo"
            className="drivein-brand-img"
          />
        </div>

        {/* Drive-In Low Front 3/4 Vehicle Approach & Speed Pass */}
        <DriveInVehicle active={isVehicleActive} showTrail={showTrail} />

        {/* Oxanium Metallic AE-SIMULATORS Wordmark Constructed by Light Trail */}
        <DriveInWordmark active={isWordmarkActive} />

        {/* Space Grotesk White Tagline Reveal */}
        <DriveInTagline active={isTaglineActive} />
      </div>
    </div>
  );
}
