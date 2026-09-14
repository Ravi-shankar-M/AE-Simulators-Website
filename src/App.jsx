import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import BrandIntro from './components/common/BrandIntro/BrandIntro';
import WhatsAppWidget from './components/common/WhatsAppWidget';
import SmoothScroll from './components/common/SmoothScroll';
import SEOHelper from './components/common/SEOHelper';

import Dashboard from './pages/Dashboard/Dashboard';
import Simulators from './pages/Simulators/Simulators';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';

import MotionPlatformPage from './pages/MotionPlatform/MotionPlatform';
import SoftwarePlatformPage from './pages/SoftwarePlatform/SoftwarePlatform';
import TechnologyPage from './pages/Technology/Technology';
import CareersPage from './pages/Careers/Careers';

import './index.css';

const getBaseUrl = () => {
  const base = import.meta.env.BASE_URL || '/';
  return base.endsWith('/') ? base.slice(0, -1) : base;
};

const normalizePath = (path) => {
  if (!path) return '/';
  let cleaned = path.split('?')[0].split('#')[0];
  const baseUrl = getBaseUrl();
  if (baseUrl && cleaned.toLowerCase().startsWith(baseUrl.toLowerCase())) {
    cleaned = cleaned.slice(baseUrl.length);
  }
  if (cleaned.length > 1 && cleaned.endsWith('/')) {
    cleaned = cleaned.slice(0, -1);
  }
  return cleaned.toLowerCase() || '/';
};

function AppContent() {
  const [currentPath, setCurrentPath] = useState(() => normalizePath(window.location.pathname));
  
  const [introFinished, setIntroFinished] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    if (currentPath.startsWith('/products/gaming')) {
      document.title = 'Gaming Simulators | AE-Simulators Sim Racing Rigs';
    } else if (currentPath.startsWith('/products/training')) {
      document.title = 'Training Simulators | AE-Simulators Driver Training Platforms';
    } else if (currentPath.startsWith('/products')) {
      document.title = 'Products | AE-Simulators Motion Platforms & Rigs';
    } else {
      switch (currentPath) {
        case '/about':
        case '/about-us':
          document.title = 'About Us | AE-Simulators';
          break;
        case '/solutions':
          document.title = 'Simulator Products | AE-Simulators';
          break;
        case '/contact':
        case '/contact-us':
          document.title = 'Contact Us | AE-Simulators';
          break;
        case '/3dof-motion-platform':
          document.title = '3-DOF Motion Platform | AE-Simulators';
          break;
        case '/6dof-motion-platform':
        case '/motion-platform':
          document.title = '6-DOF Motion Platform | AE-Simulators';
          break;
        case '/software-platform':
          document.title = 'Driving Simulator Software | AE-Simulators';
          break;
        case '/careers':
          document.title = 'Careers | AE Simulators';
          break;
        case '/':
        default:
          document.title = 'Dashboard | AE-Simulators Professional Driving Solutions';
          break;
      }
    }
  }, [currentPath]);

  useEffect(() => {
    const handleContextMenu = (e) => {
      const target = e.target;
      if (
        target.tagName === 'IMG' ||
        target.tagName === 'SVG' ||
        target.closest('img') ||
        target.closest('svg') ||
        target.closest('.bg-overlay-image') ||
        target.closest('.editorial-img') ||
        target.closest('.ae-official-logo') ||
        (target.style && target.style.backgroundImage)
      ) {
        e.preventDefault();
        return false;
      }
    };

    const handleDragStart = (e) => {
      const target = e.target;
      if (
        target.tagName === 'IMG' ||
        target.tagName === 'SVG' ||
        target.tagName === 'CANVAS' ||
        target.closest('img') ||
        target.closest('svg') ||
        target.closest('.bg-overlay-image') ||
        target.closest('.editorial-img')
      ) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('dragstart', handleDragStart, true);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('dragstart', handleDragStart, true);
    };
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleFinishIntro = useCallback(() => {
    sessionStorage.setItem('ae_intro_seen', 'true');
    setIntroFinished(true);
  }, []);

  const handleReplayIntro = useCallback(() => {
    setIntroFinished(false);
    if (currentPath !== '/') {
      window.history.pushState({}, '', getBaseUrl() + '/');
      setCurrentPath('/');
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentPath]);

  const navigate = useCallback(
    (path) => {
      const normalized = normalizePath(path);
      if (normalized === currentPath) return;

      const targetUrl = getBaseUrl() + (normalized === '/' ? '/' : normalized);

      setTransitioning(true);
      setTimeout(() => {
        window.history.pushState({}, '', targetUrl);
        setCurrentPath(normalized);
        window.scrollTo({ top: 0, behavior: 'instant' });

        setTimeout(() => {
          setTransitioning(false);
        }, 150);
      }, 250);
    },
    [currentPath]
  );

  const renderPage = () => {
    if (currentPath === '/products') {
      return <Simulators navigate={navigate} defaultCategory="gaming" defaultSubtype="all" />;
    }
    if (currentPath === '/products/gaming') {
      return <Simulators navigate={navigate} defaultCategory="gaming" defaultSubtype="all" />;
    }
    if (currentPath === '/products/gaming/static') {
      return <Simulators navigate={navigate} defaultCategory="gaming" defaultSubtype="static" />;
    }
    if (currentPath === '/products/gaming/3dof') {
      return <Simulators navigate={navigate} defaultCategory="gaming" defaultSubtype="3dof" />;
    }
    if (currentPath === '/products/gaming/6dof') {
      return <Simulators navigate={navigate} defaultCategory="gaming" defaultSubtype="6dof" />;
    }
    if (currentPath === '/products/training') {
      return <Simulators navigate={navigate} defaultCategory="training" defaultSubtype="all" />;
    }
    if (currentPath === '/products/training/static') {
      return <Simulators navigate={navigate} defaultCategory="training" defaultSubtype="static" />;
    }
    if (currentPath === '/products/training/3dof') {
      return <Simulators navigate={navigate} defaultCategory="training" defaultSubtype="3dof" />;
    }
    if (currentPath === '/products/training/6dof') {
      return <Simulators navigate={navigate} defaultCategory="training" defaultSubtype="6dof" />;
    }
    if (currentPath === '/products/training/customized-dof') {
      return <Simulators navigate={navigate} defaultCategory="training" defaultSubtype="all" />;
    }

    switch (currentPath) {
      case '/about':
      case '/about-us':
        return <About navigate={navigate} />;
      case '/solutions':
        return <Simulators navigate={navigate} defaultCategory="training" defaultSubtype="all" />;
      case '/contact':
      case '/contact-us':
        return <Contact navigate={navigate} />;
      case '/3dof-motion-platform':
        return <MotionPlatformPage navigate={navigate} type="3DOF" />;
      case '/6dof-motion-platform':
      case '/motion-platform':
        return <MotionPlatformPage navigate={navigate} type="6DOF" />;
      case '/software-platform':
        return <SoftwarePlatformPage navigate={navigate} />;
      case '/technology':
        return <TechnologyPage navigate={navigate} />;
      case '/careers':
        return <CareersPage navigate={navigate} />;
      case '/':
      default:
        return <Dashboard navigate={navigate} onReplayIntro={handleReplayIntro} introFinished={introFinished} />;
    }
  };

  return (
    <div className="ae-website-wrapper">
      <SEOHelper currentPath={currentPath} />
      {!introFinished && currentPath === '/' && (
        <BrandIntro onFinished={handleFinishIntro} onStartReveal={handleFinishIntro} />
      )}

      <div className={`page-transition-curtain ${transitioning ? 'active' : ''}`}>
        <div className="page-transition-line" />
      </div>

      <Header currentPath={currentPath} navigate={navigate} />

      <main className="ae-main-content">{renderPage()}</main>

      <Footer navigate={navigate} onReplayIntro={handleReplayIntro} />

      <WhatsAppWidget />
    </div>
  );
}

export default function App() {
  return (
    <SmoothScroll>
      <AppContent />
    </SmoothScroll>
  );
}
