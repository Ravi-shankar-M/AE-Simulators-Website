import React, { useState, useEffect } from 'react';
import { ASSETS } from '../../data/assets';
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import ProtectedImage from '../common/ProtectedImage';

import './Navbar.css';
import indiaFlagImg from './images/india-flag.png';

const LinkedInIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const YoutubeIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

export default function Header({ currentPath = '/', navigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [isOverVideo, setIsOverVideo] = useState(() => currentPath === '/');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileGamingOpen, setMobileGamingOpen] = useState(false);
  const [mobileTrainingOpen, setMobileTrainingOpen] = useState(false);

  const dropdownTimerRef = React.useRef(null);

  const handleDropdownMouseEnter = () => {
    if (dropdownTimerRef.current) {
      clearTimeout(dropdownTimerRef.current);
      dropdownTimerRef.current = null;
    }
    setProductsDropdownOpen(true);
  };

  const handleDropdownMouseLeave = () => {
    if (dropdownTimerRef.current) {
      clearTimeout(dropdownTimerRef.current);
    }
    dropdownTimerRef.current = setTimeout(() => {
      setProductsDropdownOpen(false);
      setActiveSubMenu(null);
    }, 1000);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      if (currentPath === '/') {
        const videoElement = document.querySelector('.dashboard-video-header') || document.querySelector('.dashboard-video-header-section');
        const videoHeight = videoElement ? videoElement.offsetHeight - 80 : (window.innerHeight - 80);
        setIsOverVideo(window.scrollY < videoHeight);
      } else {
        setIsOverVideo(false);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [currentPath]);

  const handleNavClick = (path, e) => {
    if (e) e.preventDefault();
    if (dropdownTimerRef.current) {
      clearTimeout(dropdownTimerRef.current);
      dropdownTimerRef.current = null;
    }
    setMobileMenuOpen(false);
    setProductsDropdownOpen(false);
    setActiveSubMenu(null);
    if (navigate) {
      navigate(path);
    }
  };

  const isProductsActive = currentPath.startsWith('/products') || currentPath === '/solutions';
  const isDashboard = currentPath === '/';

  return (
    <header className={`ae-header-wrapper ${isDashboard ? (isOverVideo ? 'is-over-video' : 'solid-white') : 'solid-red'} ${scrolled ? 'scrolled' : ''}`}>
      <div className="ae-main-navbar">
        <div className="header-container">
          <div className="brand-wrapper">
            <div className="logo-box" onClick={(e) => handleNavClick('/', e)}>
              <ProtectedImage
                src={ASSETS.logo.official}
                alt="AE Simulators Official Logo"
                className="ae-official-logo"
              />
            </div>
            <div className="brand-india-tag font-mono">
              <img
                src={indiaFlagImg}
                alt="India Flag"
                className="brand-india-flag"
              />
            </div>
          </div>

          <nav className="desktop-nav" aria-label="Main Navigation">
            <a
              href="/"
              className={`nav-link ${currentPath === '/' ? 'active' : ''}`}
              onClick={(e) => handleNavClick('/', e)}
              aria-current={currentPath === '/' ? 'page' : undefined}
            >
              DASHBOARD
            </a>

            <a
              href="/about"
              className={`nav-link ${currentPath === '/about' || currentPath === '/about-us' ? 'active' : ''}`}
              onClick={(e) => handleNavClick('/about', e)}
              aria-current={currentPath === '/about' || currentPath === '/about-us' ? 'page' : undefined}
            >
              ABOUT US
            </a>

            <div
              className="nav-item-dropdown"
              onMouseEnter={handleDropdownMouseEnter}
              onMouseLeave={handleDropdownMouseLeave}
            >
              <a
                href="#simulators-menu"
                className={`nav-link ${isProductsActive ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  if (dropdownTimerRef.current) {
                    clearTimeout(dropdownTimerRef.current);
                    dropdownTimerRef.current = null;
                  }
                  setProductsDropdownOpen((prev) => !prev);
                }}
                aria-expanded={productsDropdownOpen}
                aria-haspopup="true"
              >
                SIMULATORS <ChevronDown size={14} className="dropdown-arrow" style={{ transform: productsDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </a>

              {productsDropdownOpen && (
                <div className="products-flyout-dropdown font-mono" role="menu" aria-label="Products Menu">
                  <div
                    className={`flyout-menu-item ${activeSubMenu === 'gaming' ? 'active' : ''}`}
                    onMouseEnter={() => setActiveSubMenu('gaming')}
                    onFocus={() => setActiveSubMenu('gaming')}
                    role="menuitem"
                    tabIndex={0}
                  >
                    <a
                      href="/products/gaming"
                      className="flyout-item-link"
                      onClick={(e) => handleNavClick('/products/gaming', e)}
                    >
                      <span>GAMING SIMULATORS</span>
                      <ChevronRight size={14} className="flyout-arrow-right" />
                    </a>

                    {activeSubMenu === 'gaming' && (
                      <div className="sub-flyout-menu right-flyout font-body" role="menu" aria-label="Gaming Simulators Submenu">
                        <a
                          href="/products/gaming/static"
                          className={`sub-flyout-item ${currentPath === '/products/gaming/static' ? 'active' : ''}`}
                          onClick={(e) => handleNavClick('/products/gaming/static', e)}
                          role="menuitem"
                        >
                          - Static Simulators
                        </a>
                        <a
                          href="/products/gaming/3dof"
                          className={`sub-flyout-item ${currentPath === '/products/gaming/3dof' ? 'active' : ''}`}
                          onClick={(e) => handleNavClick('/products/gaming/3dof', e)}
                          role="menuitem"
                        >
                          - 3-DOF Simulators
                        </a>
                        <a
                          href="/products/gaming/6dof"
                          className={`sub-flyout-item ${currentPath === '/products/gaming/6dof' ? 'active' : ''}`}
                          onClick={(e) => handleNavClick('/products/gaming/6dof', e)}
                          role="menuitem"
                        >
                          - 6-DOF Simulators
                        </a>
                      </div>
                    )}
                  </div>

                  <div
                    className={`flyout-menu-item ${activeSubMenu === 'training' ? 'active' : ''}`}
                    onMouseEnter={() => setActiveSubMenu('training')}
                    onFocus={() => setActiveSubMenu('training')}
                    role="menuitem"
                    tabIndex={0}
                  >
                    <a
                      href="/products/training"
                      className="flyout-item-link"
                      onClick={(e) => handleNavClick('/products/training', e)}
                    >
                      <span>TRAINING SIMULATORS</span>
                      <ChevronRight size={14} className="flyout-arrow-right" />
                    </a>

                    {activeSubMenu === 'training' && (
                      <div className="sub-flyout-menu right-flyout font-body" role="menu" aria-label="Training Simulators Submenu">
                        <a
                          href="/products/training/static"
                          className={`sub-flyout-item ${currentPath === '/products/training/static' ? 'active' : ''}`}
                          onClick={(e) => handleNavClick('/products/training/static', e)}
                          role="menuitem"
                        >
                          - Static Simulators
                        </a>
                        <a
                          href="/products/training/3dof"
                          className={`sub-flyout-item ${currentPath === '/products/training/3dof' ? 'active' : ''}`}
                          onClick={(e) => handleNavClick('/products/training/3dof', e)}
                          role="menuitem"
                        >
                          - 3-DOF Simulators
                        </a>
                        <a
                          href="/products/training/6dof"
                          className={`sub-flyout-item ${currentPath === '/products/training/6dof' ? 'active' : ''}`}
                          onClick={(e) => handleNavClick('/products/training/6dof', e)}
                          role="menuitem"
                        >
                          - 6-DOF Simulators
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <a
              href="/contact"
              className={`nav-link ${currentPath === '/contact' || currentPath === '/contact-us' ? 'active' : ''}`}
              onClick={(e) => handleNavClick('/contact', e)}
              aria-current={currentPath === '/contact' || currentPath === '/contact-us' ? 'page' : undefined}
            >
              CONTACT US
            </a>
          </nav>

          <div className="header-follow-us font-mono">
            <span className="follow-us-title">FOLLOW US</span>
            <div className="follow-us-icons">
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="follow-social-link"
              >
                <LinkedInIcon size={15} />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="follow-social-link"
              >
                <InstagramIcon size={15} />
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="follow-social-link"
              >
                <YoutubeIcon size={15} />
              </a>
            </div>
          </div>

          <div className="header-action">
            <button
              className="mobile-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-nav-drawer" role="navigation" aria-label="Mobile Navigation">
            <div className="mobile-drawer-header">
              <span className="font-mono text-ae-red">AE SIMULATORS</span>
            </div>
            <nav className="mobile-nav-links">
              <a
                href="/"
                className={`mobile-link ${currentPath === '/' ? 'active' : ''}`}
                onClick={(e) => handleNavClick('/', e)}
                aria-current={currentPath === '/' ? 'page' : undefined}
              >
                DASHBOARD
              </a>

              <a
                href="/about"
                className={`mobile-link ${currentPath === '/about' || currentPath === '/about-us' ? 'active' : ''}`}
                onClick={(e) => handleNavClick('/about', e)}
                aria-current={currentPath === '/about' || currentPath === '/about-us' ? 'page' : undefined}
              >
                ABOUT US
              </a>

              <div className="mobile-group">
                <div
                  className="mobile-group-title font-mono flex items-center justify-between"
                  onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                >
                  <span>SIMULATORS</span>
                  <ChevronDown size={16} style={{ transform: mobileProductsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </div>

                {mobileProductsOpen && (
                  <div className="mobile-subgroup-content pl-2">
                    <div className="mobile-accordion-block mt-2">
                      <div
                        className="mobile-subgroup-header text-ae-red font-mono text-xs flex items-center justify-between cursor-pointer py-1"
                        onClick={() => setMobileGamingOpen(!mobileGamingOpen)}
                      >
                        <span>GAMING SIMULATORS</span>
                        <ChevronDown size={14} style={{ transform: mobileGamingOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                      </div>

                      {mobileGamingOpen && (
                        <div className="mobile-nested-links pl-3 mt-1 flex flex-col gap-2">
                          <a href="/products/gaming/static" className="mobile-sublink" onClick={(e) => handleNavClick('/products/gaming/static', e)}>
                            Static Simulators
                          </a>
                          <a href="/products/gaming/3dof" className="mobile-sublink" onClick={(e) => handleNavClick('/products/gaming/3dof', e)}>
                            3-DOF Simulators
                          </a>
                          <a href="/products/gaming/6dof" className="mobile-sublink" onClick={(e) => handleNavClick('/products/gaming/6dof', e)}>
                            6-DOF Simulators
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="mobile-accordion-block mt-3">
                      <div
                        className="mobile-subgroup-header text-ae-red font-mono text-xs flex items-center justify-between cursor-pointer py-1"
                        onClick={() => setMobileTrainingOpen(!mobileTrainingOpen)}
                      >
                        <span>TRAINING SIMULATORS</span>
                        <ChevronDown size={14} style={{ transform: mobileTrainingOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                      </div>

                      {mobileTrainingOpen && (
                        <div className="mobile-nested-links pl-3 mt-1 flex flex-col gap-2">
                          <a href="/products/training/static" className="mobile-sublink" onClick={(e) => handleNavClick('/products/training/static', e)}>
                            Static Simulators
                          </a>
                          <a href="/products/training/3dof" className="mobile-sublink" onClick={(e) => handleNavClick('/products/training/3dof', e)}>
                            3-DOF Simulators
                          </a>
                          <a href="/products/training/6dof" className="mobile-sublink" onClick={(e) => handleNavClick('/products/training/6dof', e)}>
                            6-DOF Simulators
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <a
                href="/contact"
                className={`mobile-link ${currentPath === '/contact' || currentPath === '/contact-us' ? 'active' : ''}`}
                onClick={(e) => handleNavClick('/contact', e)}
                aria-current={currentPath === '/contact' || currentPath === '/contact-us' ? 'page' : undefined}
              >
                CONTACT US
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
