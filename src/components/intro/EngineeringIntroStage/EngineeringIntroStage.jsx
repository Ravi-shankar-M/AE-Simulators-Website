import React, { useState, useEffect, useRef } from 'react';
import { ENG_STATES, createEngineeringTimeline } from '../../../animations/engineeringTimeline';
import IntroLogoBox from '../IntroLogoBox/IntroLogoBox';
import LaserScanner from '../../intro/LaserScanner';
import VehicleBlueprint from '../../intro/VehicleBlueprint';
import SpeedSilhouettePass from '../../intro/SpeedSilhouettePass';
import MetallicWordmark from '../../intro/MetallicWordmark';
import SimulationRoadOS from '../../intro/SimulationRoadOS';
import FinalBrandFrame from '../../intro/FinalBrandFrame';
import './EngineeringIntroStage.css';

export default function EngineeringIntroStage({ onFinished }) {
  const [currentState, setCurrentState] = useState(ENG_STATES.SCENE_01_DARK);
  const onFinishedRef = useRef(onFinished);

  useEffect(() => {
    onFinishedRef.current = onFinished;
  }, [onFinished]);

  useEffect(() => {
    console.log('AE ARRIVAL INTRO STARTED — ENGINEERING COMES ALIVE');

    const timeline = createEngineeringTimeline({
      onStateChange: (state) => {
        setCurrentState(state);
      },
      onComplete: () => {
        console.log('AE ARRIVAL INTRO COMPLETED — ENGINEERING COMES ALIVE');
        if (onFinishedRef.current) {
          onFinishedRef.current();
        }
      },
    });

    const stopTimeline = timeline.start();
    return () => stopTimeline();
  }, []);

  const isScannerActive = [
    ENG_STATES.SCENE_02_RED_SCAN,
    ENG_STATES.SCENE_03_LOGO_ACTIVATE,
  ].includes(currentState);

  const showCoordinates = [
    ENG_STATES.SCENE_03_LOGO_ACTIVATE,
    ENG_STATES.SCENE_04_BLUEPRINT,
    ENG_STATES.SCENE_05_SPEED_PASS,
    ENG_STATES.SCENE_06_LIGHT_TRAIL,
    ENG_STATES.SCENE_07_METALLIC_TITLE,
    ENG_STATES.SCENE_08_SIMULATION_OS,
    ENG_STATES.SCENE_09_MOTION_HUD,
  ].includes(currentState);

  const isBlueprintActive = [
    ENG_STATES.SCENE_04_BLUEPRINT,
    ENG_STATES.SCENE_05_SPEED_PASS,
  ].includes(currentState);

  const isSpeedPassActive = currentState === ENG_STATES.SCENE_05_SPEED_PASS;

  const showTrail = [
    ENG_STATES.SCENE_05_SPEED_PASS,
    ENG_STATES.SCENE_06_LIGHT_TRAIL,
    ENG_STATES.SCENE_07_METALLIC_TITLE,
    ENG_STATES.SCENE_08_SIMULATION_OS,
  ].includes(currentState);

  const isWordmarkActive = [
    ENG_STATES.SCENE_06_LIGHT_TRAIL,
    ENG_STATES.SCENE_07_METALLIC_TITLE,
    ENG_STATES.SCENE_08_SIMULATION_OS,
    ENG_STATES.SCENE_09_MOTION_HUD,
  ].includes(currentState);

  const isRoadActive = [
    ENG_STATES.SCENE_08_SIMULATION_OS,
    ENG_STATES.SCENE_09_MOTION_HUD,
  ].includes(currentState);

  const isHUDActive = currentState === ENG_STATES.SCENE_09_MOTION_HUD;

  const isBrandActive = [
    ENG_STATES.SCENE_10_BRAND_STATEMENT,
    ENG_STATES.SCENE_11_EXPAND_TRANSITION,
  ].includes(currentState);

  const isExpanded = currentState === ENG_STATES.SCENE_11_EXPAND_TRANSITION;

  return (
    <div className="engineering-stage-wrapper">
      {/* Atmospheric Red Glow */}
      <div className="engineering-atmosphere-glow" />

      {/* BOUNDED CINEMATIC STAGE RECTANGLE */}
      <div className={`engineering-stage-box ${isExpanded ? 'expanded' : ''}`}>
        <div className="stage-led led-tl" />
        <div className="stage-led led-tr" />
        <div className="stage-led led-bl" />
        <div className="stage-led led-br" />

        {/* Fixed AE Simulators Brand Billboard Box */}
        {!isBrandActive && <IntroLogoBox state={currentState} />}

        {/* Laser Scanner & Technical Coordinates */}
        <LaserScanner active={isScannerActive} showCoordinates={showCoordinates} />

        {/* Formula Vector Blueprint Construction */}
        <VehicleBlueprint active={isBlueprintActive} />

        {/* High-Speed Formula Silhouette Sweep & Red Light Trail */}
        <SpeedSilhouettePass active={isSpeedPassActive} showTrail={showTrail} />

        {/* Metallic Wordmark */}
        <MetallicWordmark active={isWordmarkActive} />

        {/* Simulated Road Lanes & Telemetry HUD */}
        <SimulationRoadOS activeRoad={isRoadActive} activeHUD={isHUDActive} />

        {/* Final Brand Statement & Tagline */}
        <FinalBrandFrame active={isBrandActive} />
      </div>
    </div>
  );
}
