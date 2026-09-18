import React, { useRef, useEffect, useState } from 'react';
import ProtectedImage from '../../../components/common/ProtectedImage';
import { ASSETS } from '../../../data/assets';
import { ArrowRight } from 'lucide-react';

import './Hero.css';
import dashboardLoopVideo from './videos/final_loop.mp4';
import dashboardLoopVideoTablet from './videos/final_loop-tablet.mp4';
import dashboardLoopVideoMobile from './videos/final_loop-mobile.mp4';

export default function Hero({ navigate, onReplayIntro, introFinished = true }) {
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoSrc, setVideoSrc] = useState(null);
  const [typedText, setTypedText] = useState('');
  const fullText = "WELCOME TO AE SIMULATORS";

  useEffect(() => {
    if (introFinished) {
      let currentText = '';
      let i = 0;
      setTypedText('');
      const typingInterval = setInterval(() => {
        if (i < fullText.length) {
          currentText += fullText.charAt(i);
          setTypedText(currentText);
          i++;
        } else {
          clearInterval(typingInterval);
        }
      }, 100);
      return () => clearInterval(typingInterval);
    }
  }, [introFinished]);

  useEffect(() => {
    const checkViewport = () => {
      const width = window.innerWidth;
      if (width <= 767) return dashboardLoopVideoMobile;
      if (width <= 1024) return dashboardLoopVideoTablet;
      return dashboardLoopVideo;
    };
    
    setVideoSrc(checkViewport());
    
    const handleResize = () => {
      const newSrc = checkViewport();
      setVideoSrc(prev => {
        if (prev !== newSrc) {
           return newSrc;
        }
        return prev;
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  useEffect(() => {
    if (videoRef.current && videoSrc) {
      videoRef.current.load();
      if (introFinished) {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [videoSrc, introFinished]);

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
            {videoSrc && <source src={videoSrc} type="video/mp4" />}
            Your browser does not support HTML5 video.
          </video>
          <div className="dashboard-video-watermark">
            <h1 className="dashboard-welcome-typing-text font-mono">
              {typedText}<span className="typing-cursor">|</span>
            </h1>
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
