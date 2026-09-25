import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSocialLinks, getVisibleSocialLinks } from '../../hooks/useSocialLinks';
import './GlobalHeader.css';

export const GlobalHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { links } = useSocialLinks();
  const visibleSocialLinks = getVisibleSocialLinks(links);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.pageYOffset > 10 || document.documentElement.scrollTop > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle hash navigation (scroll-to-top on route changes lives in
  // ScrollToTop, mounted once in App.tsx).
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        // Need a slight timeout to allow the page to render if navigating from another page
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-home" onClick={closeMenu}>
          Tu Concesionaria
        </Link>

        <div className="navbar-actions">
          <Link to="/stock" className="navbar-cta" onClick={closeMenu}>
            Ver stock
          </Link>

          {/* Mobile Menu Toggle */}
          <button className={`menu-toggle ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu} aria-label="Toggle Menu">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div className={`dropdown-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="menu-header">
          <h2 className="menu-brand">Tu Concesionaria</h2>
          <div className="menu-divider"></div>
        </div>

        <ul className="menu-links">
          <li><Link to="/#nosotros" onClick={closeMenu}>NOSOTROS</Link></li>
          <li><Link to="/#usados" onClick={closeMenu}>USADOS</Link></li>
          <li><Link to="/#motos" onClick={closeMenu}>MOTOS</Link></li>
          <li><Link to="/#utilitarios" onClick={closeMenu}>UTILITARIOS</Link></li>
          <li><Link to="/stock" className="highlight-link-mobile" onClick={closeMenu}>TODO EL STOCK</Link></li>
          <li><Link to="/historia" onClick={closeMenu}>HISTORIA</Link></li>
          <li><Link to="/#contacto" onClick={closeMenu}>CONTACTO</Link></li>
        </ul>

        {visibleSocialLinks.length > 0 && (
          <div className="menu-social">
            {visibleSocialLinks.map((social) => (
              <a
                key={social.key}
                className="social-icon-btn"
                aria-label={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={social.icon} alt={social.label} />
              </a>
            ))}
          </div>
        )}

        <div className="menu-rocket">
          {/* Steering wheel */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="2.5" />
            <path d="M12 14.5V22" />
            <path d="M9.6 11.3 2.5 9.5" />
            <path d="m14.4 11.3 7.1-1.8" />
          </svg>
        </div>
      </div>
    </nav>
  );
};
