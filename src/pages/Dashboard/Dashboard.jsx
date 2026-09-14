import React from 'react';

import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Hero from './Hero/Hero';

import './Dashboard.css';

export default function Dashboard({ navigate, onReplayIntro, introFinished }) {
  return (
    <div className="dashboard-page-container">
      <Hero navigate={navigate} onReplayIntro={onReplayIntro} introFinished={introFinished} />
    </div>
  );
}
