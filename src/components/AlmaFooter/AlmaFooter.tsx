import React from 'react';
import { Link } from 'react-router-dom';
import { useSocialLinks, getVisibleSocialLinks } from '../../hooks/useSocialLinks';
import './AlmaFooter.css';

export const AlmaFooter: React.FC = () => {
  const { links } = useSocialLinks();
  const visibleSocialLinks = getVisibleSocialLinks(links);

  return (
    <div className="alma-footer theme-dark">
      <div className="alma-footer-content">
        <div className="alma-footer-brand">
          <img src="/images/sitio/logo.png" alt="Logo de la concesionaria" className="alma-footer-logo" />
          <div>
            <h2>Tu Concesionaria</h2>
            <p>Autos, motos y utilitarios usados · Financiación y permutas</p>
          </div>
        </div>

        <div className="alma-footer-links">
          <p className="alma-footer-heading">Secciones</p>
          <nav className="alma-footer-nav">
            <Link to="/#nosotros">Nosotros</Link>
            <Link to="/#usados">Usados</Link>
            <Link to="/#motos">Motos</Link>
            <Link to="/#utilitarios">Utilitarios</Link>
            <Link to="/stock">Todo el stock</Link>
            <Link to="/#contacto">Contacto</Link>
          </nav>
        </div>

        <div className="alma-footer-contact">
          <p className="alma-footer-heading">Contacto</p>
          <a href="mailto:ventas@tuconcesionaria.com.ar" className="alma-footer-email">ventas@tuconcesionaria.com.ar</a>
          <p className="alma-footer-address">
            Av. Ejemplo 1234, Ciudad
            <br />
            Lunes a viernes 9 a 19 h · Sábados 9 a 13 h
          </p>
          <Link to="/creditos" className="alma-footer-credits">Créditos de fotos</Link>
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
