import React from 'react';
import Philosophy from './Philosophy/Philosophy';
import Products from './Products/Products';
import WorldMap from './WorldMap/WorldMap';

import './About.css';

export default function About({ navigate }) {
  return (
    <div className="about-page-container">
      <Products navigate={navigate} />
      <Philosophy />
      <WorldMap />
    </div>
  );
}
