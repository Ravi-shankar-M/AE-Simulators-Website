/**
 * Centralized Asset Configuration for AE-SIMULATORS Website
 * Imports original media assets from their single owner page/section folders.
 */

import officialLogo from '../components/Navbar/images/aesim-logo.png';
import motionPlatformMain from '../pages/MotionPlatform/images/ae-motion-platform.webp';
import motionPlatformSim from '../pages/MotionPlatform/images/ae-real-simulator.webp';
import motionPlatformCockpit from '../pages/MotionPlatform/images/ae-simulator-cockpit.webp';
import motionPlatformActuator from '../pages/MotionPlatform/images/ae-motion-actuator-detail.webp';

import softwareEnv from '../pages/Technology/SoftwareEngine/images/ae-software-environment.webp';
import softwareTel from '../pages/Technology/SoftwareEngine/images/ae-telemetry-report.webp';

export const ASSETS = {
  // Official AE Simulators Brand Logo
  logo: {
    official: officialLogo,
  },

  // Motion Platform Simulator Hardware Assets
  motionPlatform: {
    main: motionPlatformMain,
    simulator: motionPlatformSim,
    cockpit: motionPlatformCockpit,
    actuatorDetail: motionPlatformActuator,
  },

  // Simulator Software & Telemetry Assets
  software: {
    environment: softwareEnv,
    telemetry: softwareTel,
  },
};

export default ASSETS;
