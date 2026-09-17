import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { GlobalHeader } from '../../components/GlobalHeader/GlobalHeader';
import { Footer } from '../../components/Footer/Footer';
import { Seo } from '../../components/Seo/Seo';
import { InscriptionForm } from '../../components/InscriptionForm/InscriptionForm';
import { useSupabaseItem } from '../../hooks/useSupabaseItem';
import { useSupabaseTable } from '../../hooks/useSupabaseTable';
import { useInfiniteCarousel } from '../../hooks/useInfiniteCarousel';
import type { TableName } from '../../types/content';
import '../Home.css';
import './ContentDetail.css';

const LATEST_NEWS_COUNT = 6;

const BACK_LINKS: Record<TableName, { to: string; label: string }> = {
  courses: { to: '/#cursos', label: 'Volver a Cursos' },
  events: { to: '/#eventos', label: 'Volver a Eventos' },
  news: { to: '/#noticias', label: 'Volver a Noticias' },
};

// Used for <title>/meta while the row is still loading or missing, so the tab
// and social previews never fall back to a bare "· Tu Marca".
const SEO_FALLBACKS: Record<TableName, { title: string; description: string }> = {
  courses: { title: 'Curso', description: 'Detalle de un curso de ejemplo.' },
  events: { title: 'Evento', description: 'Detalle de un evento de ejemplo.' },
  news: { title: 'Noticia', description: 'Detalle de una noticia de ejemplo.' },
};

interface ContentDetailProps {
  table: TableName;
}

export const ContentDetail: React.FC<ContentDetailProps> = ({ table }) => {
  const { id } = useParams<{ id: string }>();
  const { item, loading, error } = useSupabaseItem(table, id);
  const { items: allNews } = useSupabaseTable('news');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const backLink = BACK_LINKS[table];

  // Exclude the article being viewed from its own "latest news" carousel.
  const latestNews = allNews
    .filter((newsItem) => !(table === 'news' && newsItem.id === id))
    .slice(-LATEST_NEWS_COUNT);
  const newsCardsPerView = isMobile ? 1 : 2;
  const newsCarousel = useInfiniteCarousel(Math.max(latestNews.length, 1), newsCardsPerView);

  return (
    <div className="content-detail-page">
      <Seo
        title={item?.title ?? SEO_FALLBACKS[table].title}
        description={item?.description ?? SEO_FALLBACKS[table].description}
        type={table === 'news' ? 'article' : 'website'}
      />
      <div className="stars-bg stars-bg--fixed"></div>
      <div className="content-detail-stack">
      <GlobalHeader />

      <main className="content-detail-main">
        {loading ? (
          <p className="content-detail-status">Cargando...</p>
        ) : error || !item ? (
          <div className="content-detail-status">
            <p>{error ? `Error al cargar el contenido: ${error}` : 'No encontramos este contenido.'}</p>
            <Link to={backLink.to} className="content-detail-back">{backLink.label}</Link>
          </div>
        ) : (
          <>
          <article className="content-detail-article">
            <Link to={backLink.to} className="content-detail-back">← {backLink.label}</Link>

            {item.imageUrl && (
              <div className="content-detail-image-wrapper">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className={`content-detail-image ${item.isFinished ? 'is-finished' : ''}`}
                />
              </div>
            )}

            <span className="content-detail-date">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              {item.dateTime}
            </span>
            <h1 className="content-detail-title">{item.title}</h1>
            <p className="content-detail-description">{item.description}</p>

            {table !== 'news' && (
              <div className="content-detail-form-wrapper">
                {item.isFinished ? (
                  <p className="content-detail-finished-notice">
                    Este {table === 'courses' ? 'curso' : 'evento'} ya finalizó. Ya no se aceptan nuevas inscripciones.
                  </p>
                ) : (
                  <InscriptionForm table={table} itemId={item.id} itemTitle={item.title} />
                )}
              </div>
            )}
          </article>

          {latestNews.length > 0 && (
            <section className="content-detail-latest-news">
              <h2 className="section-title">Últimas Noticias</h2>
              <div className="slideshow-wrapper">
                <button className="slideshow-arrow prev" onClick={newsCarousel.prev} aria-label="Anterior">
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <button className="slideshow-arrow next" onClick={newsCarousel.next} aria-label="Siguiente">
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>

                <div className="slideshow-track-outer">
                  <div
                    className="slideshow-track"
                    onTransitionEnd={newsCarousel.handleTransitionEnd}
                    style={{
                      transform: `translateX(-${newsCarousel.extIndex * newsCarousel.percentPerSlide}%)`,
                      transition: !newsCarousel.transitionEnabled ? 'none' : 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
                    }}
                  >
                    {newsCarousel.renderIndices.map((newsIdx, i) => {
                      const newsItem = latestNews[newsIdx];
                      return (
                        <div className="slideshow-slide" key={`${newsItem.id}-${i}`}>
                          <div className="news-card">
                            <div className="news-image-wrapper">
                              <img src={newsItem.imageUrl ?? ''} alt={newsItem.title} className="news-image" draggable="false" />
                              <div className="news-image-overlay"></div>
                            </div>
                            <div className="news-content">
                              <span className="news-date-badge">
                                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="clock-icon"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                {newsItem.dateTime}
                              </span>
                              <h3 className="news-title">{newsItem.title}</h3>
                              <p className="news-description">{newsItem.description}</p>
                              <Link className="cta-button news-enroll-btn" to={`/noticias/${newsItem.id}`}>
                                Leer más
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="slideshow-dots">
                  {Array.from({ length: newsCarousel.total }).map((_, index) => (
                    <button
                      key={index}
                      className={`slideshow-dot ${index === newsCarousel.activeDot ? 'active' : ''}`}
                      onClick={() => newsCarousel.goToReal(index)}
                      aria-label={`Ir a diapositiva ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}
          </>
        )}
      </main>

      <Footer />
      </div>
    </div>
  );
};
