import React, { useEffect, useRef, useState } from 'react';
import './BrandIntro.css';
import introVideo from '../../../pages/Dashboard/Hero/videos/AE_SIMULATORS_intro_web_delivery.mp4';
import introAudio from '../../../pages/Dashboard/Hero/videos/AE_SIMULATORS_intro_audio.mp3';

export default function BrandIntro({ onFinished, onStartReveal }) {
  const [fadingOut, setFadingOut] = useState(false);

  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const doneRef = useRef(false);

  /* ── Dismiss function ── */
  const dismiss = () => {
    if (doneRef.current) return;
    doneRef.current = true;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (videoRef.current) {
      videoRef.current.pause();
    }

    if (onStartReveal) onStartReveal();
    setFadingOut(true);
    setTimeout(() => onFinished && onFinished(), 500);
  };

  /* ── Safety Buffer Timer (If video takes > 2.5s to start, auto-dismiss smoothly) ── */
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      const video = videoRef.current;
      if (!doneRef.current && (!video || video.paused || video.currentTime === 0)) {
        dismiss();
      }
    }, 2500);

    const maxTimer = setTimeout(dismiss, 10000);

    return () => {
      clearTimeout(safetyTimer);
      clearTimeout(maxTimer);
      if (audioRef.current) audioRef.current.pause();
      if (videoRef.current) videoRef.current.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Autoplay Video + Audio with Guaranteed Zero Black-Screen Autoplay ── */
  useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;

    if (!video || !audio) return;

    // Set 1.5x playback speed for both video & audio
    video.playbackRate = 1.5;
    audio.playbackRate = 1.5;

    // Guaranteed instant video playback start
    video.muted = true;
    video.play().catch(() => {});

    // Try unmuting audio synchronously
    const enableAudio = async () => {
      try {
        audio.currentTime = video.currentTime;
        await audio.play();
        video.muted = false;
        audio.muted = false;
      } catch (err) {
        // If unmuted audio is blocked by browser policy, listen for first user click/touch to unmute
        const unmuteOnUserGesture = () => {
          if (!doneRef.current && video && audio) {
            video.muted = false;
            audio.muted = false;
            audio.currentTime = video.currentTime;
            audio.play().catch(() => {});
          }
          window.removeEventListener('pointerdown', unmuteOnUserGesture);
          window.removeEventListener('keydown', unmuteOnUserGesture);
        };

        window.addEventListener('pointerdown', unmuteOnUserGesture, { once: true });
        window.addEventListener('keydown', unmuteOnUserGesture, { once: true });
      }
    };

    enableAudio();

    // Synchronize audio strictly with video time
    const handleTimeUpdate = () => {
      if (!audio || !video) return;
      const drift = Math.abs(audio.currentTime - video.currentTime);
      if (drift > 0.1) {
        audio.currentTime = video.currentTime;
      }
    };

    const handlePlay = () => {
      if (audio && !video.muted) {
        audio.currentTime = video.currentTime;
        audio.play().catch(() => {});
      }
    };

    const handlePause = () => {
      if (audio) audio.pause();
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', dismiss);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', dismiss);
    };
  }, [dismiss]);

  return (
    <div
      className={`brand-intro-backdrop${fadingOut ? ' fade-out' : ''}`}
    >
      {/* ── Fullscreen Intro Video ── */}
      <video
        ref={videoRef}
        id="ae-intro-video"
        className="intro-video-element"
        src={introVideo}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={dismiss}
        onError={dismiss}
      />

      {/* ── Synchronized Intro Audio ── */}
      <audio
        ref={audioRef}
        id="ae-intro-audio"
        src={introAudio}
        autoPlay
        preload="auto"
        onError={() => {}}
      />
    </div>
  );
}
