import React from 'react';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <a href="https://zonodev.ar/es/" target="_blank" rel="noopener noreferrer" className="footer-branding">
          <div className="footer-logo-container">
            <img src="/images/Zonodev/zonodevLogo.png" alt="Zonodev Logo" className="footer-logo" />
            <h2>Zonodev</h2>
          </div>
          <p>Sistemas de Gestión y Desarrollo Web</p>
        </a>

        <div className="footer-social-wrapper">
          <div className="footer-socials">
            <a href="https://zonodev.ar/es/" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Sitio web">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/zonodev" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="LinkedIn">
              <img src="/images/Iconos50x50/icons8-linkedin-50.svg" alt="LinkedIn" />
            </a>
            <a href="https://www.instagram.com/zonodev/" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Instagram">
              <img src="/images/Iconos50x50/icons8-instagram-50.svg" alt="Instagram" />
            </a>
          </div>
        </div>

        <p className="footer-copyright">Website design by Zonodev</p>
      </div>
    </footer>
  );
};
