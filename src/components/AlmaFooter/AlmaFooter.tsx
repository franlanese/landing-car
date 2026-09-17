import React from 'react';
import { Link } from 'react-router-dom';
import { useSocialLinks, getVisibleSocialLinks } from '../../hooks/useSocialLinks';
import './AlmaFooter.css';

export const AlmaFooter: React.FC = () => {
  const { links } = useSocialLinks();
  const visibleSocialLinks = getVisibleSocialLinks(links);

  return (
    <div className="alma-footer">
      <div className="alma-footer-content">
        <div className="alma-footer-brand">
          <img src="/images/placeholder/logo.svg" alt="Logo de tu marca" className="alma-footer-logo" />
          <div>
            <h2>Tu Marca</h2>
            <p>Tu Marca · Plantilla de landing page</p>
          </div>
        </div>

        <div className="alma-footer-links">
          <p className="alma-footer-heading">Secciones</p>
          <nav className="alma-footer-nav">
            <Link to="/#nosotros">Nosotros</Link>
            <Link to="/#cursos">Cursos</Link>
            <Link to="/#eventos">Eventos</Link>
            <Link to="/#noticias">Noticias</Link>
            <Link to="/#contacto">Contacto</Link>
          </nav>
        </div>

        <div className="alma-footer-contact">
          <p className="alma-footer-heading">Contacto</p>
          <a href="mailto:contacto@tumarca.com" className="alma-footer-email">contacto@tumarca.com</a>
          {visibleSocialLinks.length > 0 && (
            <div className="alma-footer-social">
              {visibleSocialLinks.map((social) => (
                <a
                  key={social.key}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="alma-footer-social-btn"
                  aria-label={social.label}
                >
                  <img src={social.icon} alt={social.label} />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
