import React from 'react';
import { Link } from 'react-router-dom';
import { GlobalHeader } from '../../components/GlobalHeader/GlobalHeader';
import { AlmaFooter } from '../../components/AlmaFooter/AlmaFooter';
import { Footer } from '../../components/Footer/Footer';
import { Seo } from '../../components/Seo/Seo';
import { INITIAL_CONTENT } from '../../data/content';
import { PHOTO_CREDITS } from '../../data/photoCredits';
import '../Home.css';
import './Creditos.css';

// Attribution for the stock photos, required by their Creative Commons
// licenses (see src/data/photoCredits.ts).
export const Creditos: React.FC = () => (
  <div className="creditos-container">
    <Seo title="Créditos de fotos" description="Autores y licencias de las fotos usadas en el sitio." noindex />
    <GlobalHeader />

    <section className="creditos-page">
      <div className="creditos-header">
        <Link to="/" className="creditos-back">&larr; Volver al inicio</Link>
        <h1 className="section-title">CRÉDITOS DE FOTOS</h1>
        <p className="creditos-intro">
          Las fotos de las unidades son de ejemplo y provienen de{' '}
          <a href="https://commons.wikimedia.org" target="_blank" rel="noopener noreferrer">Wikimedia Commons</a>,
          publicadas por sus autores bajo licencias libres.
        </p>
      </div>

      <ul className="creditos-list">
        {PHOTO_CREDITS.map((credit) => {
          const unit = INITIAL_CONTENT[credit.table].find((item) => item.id === credit.id);
          return (
            <li key={`${credit.table}-${credit.id}`} className="creditos-item">
              <img src={unit?.imageUrl ?? ''} alt="" className="creditos-thumb" loading="lazy" />
              <div className="creditos-info">
                <span className="creditos-unit">{unit?.title ?? credit.id}</span>
                <span className="creditos-meta">
                  <a href={credit.source} target="_blank" rel="noopener noreferrer">{credit.file}</a>
                  {' · '}{credit.author}{' · '}
                  {credit.licenseUrl ? (
                    <a href={credit.licenseUrl} target="_blank" rel="noopener noreferrer">{credit.license}</a>
                  ) : (
                    credit.license
                  )}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>

    <AlmaFooter />
    <Footer />
  </div>
);
