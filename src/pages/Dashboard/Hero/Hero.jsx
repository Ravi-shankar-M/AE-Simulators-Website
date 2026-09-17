import React, { useRef, useEffect, useState } from 'react';
import ProtectedImage from '../../../components/common/ProtectedImage';
import { ASSETS } from '../../../data/assets';
import { ArrowRight } from 'lucide-react';

import './Hero.css';
import dashboardLoopVideo from './videos/Final_DB_Loop.mp4';

export default function Hero({ navigate, onReplayIntro, introFinished = true }) {
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;

      if (introFinished) {
        const attemptPlay = () => {
          if (video.paused) {
            video.currentTime = 0;
            video.play().then(() => {
              setVideoLoaded(true);
            }).catch((err) => {
              console.warn('Dashboard video play notice:', err);
            });
          }
        };

        attemptPlay();
        video.addEventListener('canplaythrough', attemptPlay);
        return () => {
          video.removeEventListener('canplaythrough', attemptPlay);
        };
      } else {
        video.pause();
        video.currentTime = 0;
      }
    }
  }, [introFinished]);

  const handleVideoLoadedData = (e) => {
    setVideoLoaded(true);
    const video = e.target;
    video.muted = true;
    if (introFinished) {
      if (video.paused) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
    } else {
      video.pause();
      video.currentTime = 0;
    }
  };

  return (
    <React.Fragment>
      {/* 00 — DASHBOARD LOOP VIDEO HEADER PRESENTATION */}
      <section className="dashboard-video-header-section">
        <div className="dashboard-video-wrapper">
          <video
            ref={videoRef}
            className={`dashboard-loop-video ${videoLoaded ? 'loaded' : ''}`}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onLoadedData={handleVideoLoadedData}
            onCanPlay={handleVideoLoadedData}
            onError={() => setVideoLoaded(true)}
            onWaiting={() => {}}
            onStalled={() => {}}
          >
            <source src={dashboardLoopVideo} type="video/mp4" />
            Your browser does not support HTML5 video.
          </video>
          <div className="dashboard-video-watermark">
            <span className="dashboard-welcome-tag font-mono">WELCOME TO</span>
            <ProtectedImage
              src={ASSETS.logo.official}
              alt="AE Simulators Official Logo"
              className="dashboard-video-watermark-logo"
            />
            <button
              type="button"
              className="dashboard-explore-products-btn font-mono"
              onClick={(e) => {
                if (e) e.preventDefault();
                if (navigate) navigate('/simulators');
              }}
            >
              EXPLORE OUR PRODUCTS <ArrowRight size={18} style={{ marginLeft: '8px' }} />
            </button>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}
