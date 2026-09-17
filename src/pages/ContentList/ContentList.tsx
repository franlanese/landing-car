import React from 'react';
import { Link } from 'react-router-dom';
import { GlobalHeader } from '../../components/GlobalHeader/GlobalHeader';
import { AlmaFooter } from '../../components/AlmaFooter/AlmaFooter';
import { Footer } from '../../components/Footer/Footer';
import { Seo } from '../../components/Seo/Seo';
import { useSupabaseTable } from '../../hooks/useSupabaseTable';
import type { TableName } from '../../types/content';
import '../Home.css';
import './ContentList.css';

const ROUTE_PREFIX: Record<TableName, string> = {
  courses: 'cursos',
  events: 'eventos',
  news: 'noticias',
};

interface ContentListProps {
  table: TableName;
  pageTitle: string;
  seoTitle: string;
  seoDescription: string;
  emptyLabel: string;
  ctaLabel: string;
  cardPrefix: 'course' | 'event' | 'news';
}

export const ContentList: React.FC<ContentListProps> = ({ table, pageTitle, seoTitle, seoDescription, emptyLabel, ctaLabel, cardPrefix }) => {
  const { items, loading, error } = useSupabaseTable(table);

  return (
    <div className="content-list-container">
      <Seo title={seoTitle} description={seoDescription} />
      <div className="stars-bg stars-bg--fixed"></div>
      <div className="content-list-stack">
      <GlobalHeader />

      <section className="content-list-page">
        <div className="content-list-header">
          <Link to="/" className="content-list-back">&larr; Volver al inicio</Link>
          <h1 className="section-title">{pageTitle}</h1>
        </div>

        {loading || items.length === 0 ? (
          <div className="content-loading">
            {loading ? 'Cargando...' : error ? `Error al cargar: ${error}` : emptyLabel}
          </div>
        ) : (
          <div className="content-list-grid">
            {items.map((item) => (
              <div className={`${cardPrefix}-card ${item.isFinished ? 'is-finished' : ''}`} key={item.id}>
                <div className={`${cardPrefix}-image-wrapper`}>
                  <img src={item.imageUrl ?? ''} alt={item.title} className={`${cardPrefix}-image`} />
                  <div className={`${cardPrefix}-image-overlay`}></div>
                </div>
                <div className={`${cardPrefix}-content`}>
                  <span className={`${cardPrefix}-date-badge`}>
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="clock-icon"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    {item.dateTime}
                  </span>
                  <h3 className={`${cardPrefix}-title`}>{item.title}</h3>
                  <p className={`${cardPrefix}-description`}>{item.description}</p>
                  <Link className={`cta-button ${cardPrefix}-enroll-btn`} to={`/${ROUTE_PREFIX[table]}/${item.id}`}>
                    {ctaLabel}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <AlmaFooter />
      <Footer />
      </div>
    </div>
  );
};
