import React from 'react';
import Philosophy from './Philosophy/Philosophy';
import WhatWeBuild from '../Dashboard/WhatWeBuild/WhatWeBuild';
import WorldMap from './WorldMap/WorldMap';

import './About.css';

export default function About({ navigate }) {
  return (
    <div className="about-page-container">
      <Philosophy />
      <WhatWeBuild navigate={navigate} />
      <WorldMap />
    </div>
  );
}
