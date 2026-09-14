import React, { useState, useEffect } from 'react';
import GamingSimulators from './Gaming/GamingSimulators';
import TrainingSimulators from './Training/TrainingSimulators';

import './Simulators.css';

export default function Simulators({ navigate, defaultCategory = 'gaming', defaultSubtype = 'all' }) {
  const [activeCategory, setActiveCategory] = useState(defaultCategory);

  useEffect(() => {
    setActiveCategory(defaultCategory);
  }, [defaultCategory]);

  return (
    <div className="simulators-page-container">
      {activeCategory === 'gaming' ? (
        <GamingSimulators navigate={navigate} activeSubtype={defaultSubtype} />
      ) : (
        <TrainingSimulators navigate={navigate} activeSubtype={defaultSubtype} />
      )}
    </div>
  );
}
