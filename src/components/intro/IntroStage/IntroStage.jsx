import React, { useState, useEffect, useRef } from 'react';
import { SIMULATOR_3D_STATES, createSimulator3DTimeline } from '../../../animations/simulatorIntroTimeline';
import IntroLogoBox from '../IntroLogoBox/IntroLogoBox';
import SimulatorIntroScene from '../../three/SimulatorIntroScene';
import { triggerSoundEvent } from '../../../utils/soundHooks';
import './IntroStage.css';

export default function IntroStage({ onFinished }) {
  const [currentState, setCurrentState] = useState(SIMULATOR_3D_STATES.LOGO_CALM);
  const [isWiping, setIsWiping] = useState(false);
  const onFinishedRef = useRef(onFinished);

  useEffect(() => {
    onFinishedRef.current = onFinished;
  }, [onFinished]);

  // Central 3D Timeline Scheduler
  useEffect(() => {
    console.log('AE ARRIVAL INTRO STARTED');

    const timeline = createSimulator3DTimeline({
      onStateChange: (state) => {
        setCurrentState(state);
        triggerSoundEvent(state);

        // Trigger red laser streak wipe transition at 9.5s
        if (state === SIMULATOR_3D_STATES.FINAL_BRAND) {
          setTimeout(() => setIsWiping(true), 200);
        }
      },
      onComplete: () => {
        console.log('AE ARRIVAL INTRO COMPLETED');
        if (onFinishedRef.current) {
          onFinishedRef.current();
        }
      },
    });

    const stopTimeline = timeline.start();
    return () => stopTimeline();
  }, []);

  return (
    <div className="intro-stage-container">
      {/* Red Laser Streak Transition Wipe Overlay */}
      <div className={`arrival-transition-wipe ${isWiping ? 'active' : ''}`} />

      {/* Atmospheric Background */}
      <div className="intro-stage-atmosphere" />

      {/* BOUNDED CINEMATIC 3D STAGE RECTANGLE (overflow: hidden) */}
      <div className="cinematic-stage-box">
        <div className="corner-led corner-tl" />
        <div className="corner-led corner-tr" />
        <div className="corner-led corner-bl" />
        <div className="corner-led corner-br" />

        {/* Fixed AE Simulators Brand Billboard Box */}
        <IntroLogoBox state={currentState} />

        {/* Real-time Three.js + R3F 3D Scene */}
        <SimulatorIntroScene state={currentState} />
      </div>
    </div>
  );
}
