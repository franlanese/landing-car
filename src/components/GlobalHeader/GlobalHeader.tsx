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

  // Handle hash navigation
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        // Need a slight timeout to allow the page to render if navigating from another page
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-home" onClick={closeMenu}>
          Tu Marca
        </Link>


        {/* Mobile Menu Toggle */}
        <button className={`menu-toggle ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu} aria-label="Toggle Menu">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <div className={`dropdown-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="menu-header">
          <h2 className="menu-brand">Tu Marca</h2>
          <div className="menu-divider"></div>
        </div>

        <ul className="menu-links">
          <li><Link to="/#nosotros" onClick={closeMenu}>NOSOTROS</Link></li>
          <li><Link to="/#cursos" onClick={closeMenu}>CURSOS</Link></li>
          <li><Link to="/#eventos" onClick={closeMenu}>EVENTOS</Link></li>
          <li><Link to="/#noticias" onClick={closeMenu}>NOTICIAS</Link></li>
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
          <svg viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="9" />
          </svg>
        </div>
      </div>
    </nav>
  );
};
