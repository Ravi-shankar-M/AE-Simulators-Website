/**
 * Centralized Site & SEO Metadata Configuration for AE-SIMULATORS Website
 */

export const SITE_CONFIG = {
  name: 'AE-SIMULATORS',
  legalName: 'AE Simulators',
  tagline: 'Professional Driving Simulator Solutions & Motion Platforms',
  description: 'AE-SIMULATORS delivers professional driving simulator hardware, 6-DOF & 3-DOF motion platforms, and real-road simulation software for driver training, evaluation, and automotive R&D.',
  
  // Production Domain
  productionDomain: 'https://ravi-shankar-m.github.io/AE-Simulators-Website',
  
  defaultOgImage: '/logo/ae-automation-engineers.png',
  
  address: {
    streetAddress: 'No 11/3, Irugur road, Ondipudur',
    addressLocality: 'Coimbatore',
    addressRegion: 'Tamil Nadu',
    postalCode: '641016',
    addressCountry: 'IN',
  },
  
  contact: {
    email: 'aesimulators@outlook.com',
    phone: '+919345764379',
  }
};

/**
 * Route-Specific SEO Metadata Registry
 */
export const SEO_REGISTRY = {
  '/': {
    title: 'AE-SIMULATORS | Professional Driving Simulators & Motion Platforms',
    description: 'Engineering high-fidelity 6-DOF & 3-DOF driving simulators, telemetry analytics, and realistic driving simulation software for driver evaluation and vehicle testing.',
    keywords: 'driving simulator, 6-DOF motion platform, 3-DOF motion platform, 6-DOF hexapod, telemetry analytics, vehicle testing, driver training simulator',
    h1: 'DRIVE REAL. TRAIN BETTER.',
  },
  '/about': {
    title: 'About Us | AE-SIMULATORS Professional Motion Platform Manufacturer',
    description: 'Learn about AE-SIMULATORS worldwide simulator footprint, engineering philosophy, and custom 6-DOF & 3-DOF hexapod platform solutions.',
    keywords: 'AE-SIMULATORS about, simulator manufacturer, 6-DOF hexapod, motion platform engineering, driving simulator manufacturer India',
    h1: 'ENGINEERED FOR REAL-WORLD TRAINING & SIMULATION',
  },
  '/simulators': {
    title: 'Simulator Products & Motion Platforms | AE-SIMULATORS',
    description: 'Explore AE-SIMULATORS product catalog including 6-DOF motion platforms, 3-DOF motion platforms, professional sim racing rigs, and driver training platforms.',
    keywords: 'simulator products, 6-DOF motion platform, 3-DOF motion platform, sim racing rigs, driver training platforms, force-feedback controls',
    h1: 'PROFESSIONAL SIMULATOR PRODUCTS & MOTION RIGS',
  },
  '/simulators/gaming': {
    title: 'Gaming Simulators & Sim Racing Rigs | AE-SIMULATORS',
    description: 'High-performance sim racing cockpits and dynamic 3-DOF / 6-DOF motion gaming platforms built for ultimate motorsport realism.',
    keywords: 'sim racing rigs, gaming simulators, 6-DOF gaming platform, force-feedback racing cockpit',
    h1: 'MOTORSPORT SIM RACING & GAMING RIGS',
  },
  '/simulators/training': {
    title: 'Driver Training & Evaluation Simulators | AE-SIMULATORS',
    description: 'Turnkey driver training simulators equipped with real-time collision detection, driver scoring, hazard logging, and telemetry reports.',
    keywords: 'driver training simulator, driver evaluation, driver scoring, telemetry report, vehicle testing simulator',
    h1: 'DRIVER TRAINING & EVALUATION SIMULATORS',
  },
  '/motion-platform': {
    title: '6-DOF & 3-DOF Motion Platforms | AE-SIMULATORS Kinematics',
    description: 'Precision 6-DOF motion platforms and 3-DOF motion platforms powered by high-torque brushless servos and ball screw linear actuators.',
    keywords: '6-DOF motion platform, 3-DOF motion platform, 6-DOF motion platform, brushless servos, ball screws, kinematics',
    h1: 'PRECISION 6-DOF & 3-DOF MOTION PLATFORMS',
  },
  '/software-platform': {
    title: 'Driving Simulator Software & Physics Engine | AE-SIMULATORS',
    description: 'Real-road driving simulation software featuring asphalt friction modeling, collision detection, proximity alerting, and impact telemetry recording.',
    keywords: 'driving simulation software, real-road simulation, collision detection, telemetry, vehicle dynamics simulator',
    h1: 'REAL-ROAD SIMULATION SOFTWARE ENGINE',
  },
  '/technology': {
    title: 'Simulator Software Engine & Telemetry | AE-SIMULATORS',
    description: 'Discover the technological core powering AE-SIMULATORS real-time scenario generation, vehicle dynamics, and driver scoring engines.',
    keywords: 'simulator software engine, telemetry report, driving simulation technology, driver scoring',
    h1: 'SIMULATOR SOFTWARE & DYNAMICS ENGINE',
  },
  '/contact': {
    title: 'Contact AE-SIMULATORS | Enquire for Custom Motion Solutions',
    description: 'Get in touch with AE-SIMULATORS engineering team in Coimbatore, India for custom 6-DOF motion platform quotes and simulator product enquiries.',
    keywords: 'contact AE-SIMULATORS, simulator quote, motion platform price India, driving simulator manufacturer contact',
    h1: 'CONTACT AE-SIMULATORS ENGINEERING TEAM',
  }
};

export default SITE_CONFIG;
