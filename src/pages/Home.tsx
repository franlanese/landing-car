import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { AlmaFooter } from '../components/AlmaFooter/AlmaFooter';
import { Footer } from '../components/Footer/Footer';
import { GlobalHeader } from '../components/GlobalHeader/GlobalHeader';
import { Seo } from '../components/Seo/Seo';
import './Home.css';
import { Hero } from '../components/Hero/Hero';
import { VehicleCarousel } from '../components/VehicleCarousel/VehicleCarousel';
import { CategoryIcon } from '../components/CategoryIcon/CategoryIcon';
import { useSupabaseTable } from '../hooks/useSupabaseTable';
import { useSponsors } from '../hooks/useSponsors';
import { useInfiniteCarousel } from '../hooks/useInfiniteCarousel';
import { TABLE_LABELS, TABLE_NAMES, type ContentItem, type TableName } from '../types/content';

interface Pillar {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const PILLARS: Pillar[] = [
  {
    id: 1,
    title: "Unidades peritadas",
    description: "Cada vehículo pasa por una revisión mecánica y de chapa completa antes de salir a la venta.",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="m9 12 2 2 4-4"/>
      </svg>
    ),
  },
  {
    id: 2,
    title: "Financiación a tu medida",
    description: "Cuotas fijas en pesos con sólo DNI, y planes con las principales entidades bancarias.",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2"/>
        <line x1="2" y1="10" x2="22" y2="10"/>
        <line x1="6" y1="15" x2="10" y2="15"/>
      </svg>
    ),
  },
  {
    id: 3,
    title: "Tomamos tu usado",
    description: "Cotizamos tu auto o moto en el momento y lo tomamos como parte de pago.",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 1l4 4-4 4"/>
        <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
        <path d="M7 23l-4-4 4-4"/>
        <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
      </svg>
    ),
  },
  {
    id: 4,
    title: "Gestoría incluida",
    description: "Nos ocupamos de la transferencia, el formulario 08 y toda la documentación.",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
];

// Home previews the most recently published units of each category; the
// full list lives on /stock.
const PREVIEW_COUNT = 4;

const VIEW_ALL_LABELS: Record<TableName, string> = {
  usados: 'Ver todos los usados',
  motos: 'Ver todas las motos',
  utilitarios: 'Ver todos los utilitarios',
};

interface VehicleSectionProps {
  table: TableName;
  items: ContentItem[];
  loading: boolean;
  error: string | null;
  altBg?: boolean;
  autoplay?: boolean;
}

const VehicleSection: React.FC<VehicleSectionProps> = ({ table, items, loading, error, altBg = false, autoplay = false }) => {
  // Items come sorted oldest → newest; show the newest first.
  const preview = items.slice(-PREVIEW_COUNT).reverse();

  return (
    <section id={table} className={`home-section ${altBg ? 'alt-bg' : ''}`}>
      <div className="ambient-bg"></div>
      <h2 className="section-title reveal">{TABLE_LABELS[table]}</h2>

      {loading || preview.length === 0 ? (
        <div className="content-loading reveal reveal-scale reveal-delay-1">
          {loading ? 'Cargando unidades...' : error ? `Error al cargar unidades: ${error}` : 'Próximamente nuevas unidades.'}
        </div>
      ) : (
        <VehicleCarousel
          items={preview}
          linkTo={(item) => `/${table}/${item.id}`}
          autoplay={autoplay}
          className="reveal reveal-scale reveal-delay-1"
        />
      )}

      <div className="section-view-all">
        <Link to={`/stock?tipo=${table}`} className="cta-button">{VIEW_ALL_LABELS[table]}</Link>
      </div>
    </section>
  );
};

export const Home: React.FC = () => {
  const [isNosotrosSlide, setIsNosotrosSlide] = useState(window.innerWidth <= 640);

  const { items: sponsors } = useSponsors();
  const usados = useSupabaseTable('usados');
  const motos = useSupabaseTable('motos');
  const utilitarios = useSupabaseTable('utilitarios');
  const tables: Record<TableName, ReturnType<typeof useSupabaseTable>> = { usados, motos, utilitarios };

  const availableCount = (table: TableName) => tables[table].items.filter((item) => !item.isSold).length;
  const totalAvailable = TABLE_NAMES.reduce((sum, table) => sum + availableCount(table), 0);

  // Brands show as a static 2x2 grid when there are 4 or fewer; beyond
  // that, they're paginated into 2x2 "pages" and treated as a 1-per-view
  // infinite carousel (reusing the same clone-padded loop as the vehicle
  // carousels) so it auto-advances seamlessly with no visible rewind.
  const SPONSORS_PER_PAGE = 4;
  const sponsorPages = useMemo(() => {
    const pages: (typeof sponsors)[] = [];
    for (let i = 0; i < sponsors.length; i += SPONSORS_PER_PAGE) {
      pages.push(sponsors.slice(i, i + SPONSORS_PER_PAGE));
    }
    return pages.length > 0 ? pages : [[]];
  }, [sponsors]);
  const [isSponsorsPaused, setIsSponsorsPaused] = useState(false);
  const sponsorCarousel = useInfiniteCarousel(sponsorPages.length, 1);

  // States and Drag states for Nosotros pillars
  const [currentNosotrosIndex, setCurrentNosotrosIndex] = useState(0);
  const [isNosotrosDragging, setIsNosotrosDragging] = useState(false);
  const [nosotrosDragStartX, setNosotrosDragStartX] = useState(0);
  const [nosotrosDragOffset, setNosotrosDragOffset] = useState(0);

  // Form states
  const [contactNombre, setContactNombre] = useState("");
  const [contactApellido, setContactApellido] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactTelefono, setContactTelefono] = useState("");
  const [contactMotivo, setContactMotivo] = useState("");
  const [contactMensaje, setContactMensaje] = useState("");
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Template demo: there's no backend, so this just shows the same success
  // feedback the real form would after a successful insert. Nothing is sent
  // or persisted anywhere.
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitting(true);
    setContactError(null);
    setContactSubmitting(false);
    setContactSubmitted(true);
    setContactNombre("");
    setContactApellido("");
    setContactEmail("");
    setContactTelefono("");
    setContactMotivo("");
    setContactMensaje("");
  };

  useEffect(() => {
    const handleResize = () => {
      setIsNosotrosSlide(window.innerWidth <= 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.documentElement.classList.add('scroll-snap-active');
    return () => {
      document.documentElement.classList.remove('scroll-snap-active');
    };
  }, []);

  // Nosotros drag handlers
  const handleNosotrosPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest('button, a')) return;
    setIsNosotrosDragging(true);
    setNosotrosDragStartX(e.clientX);
    setNosotrosDragOffset(0);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleNosotrosPointerMove = (e: React.PointerEvent) => {
    if (!isNosotrosDragging) return;
    setNosotrosDragOffset(e.clientX - nosotrosDragStartX);
  };

  const handleNosotrosPointerUp = (e: React.PointerEvent) => {
    if (!isNosotrosDragging) return;
    setIsNosotrosDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
    if (nosotrosDragOffset < -60) {
      setCurrentNosotrosIndex((prev) => (prev + 1) % PILLARS.length);
    } else if (nosotrosDragOffset > 60) {
      setCurrentNosotrosIndex((prev) => (prev - 1 + PILLARS.length) % PILLARS.length);
    }
    setNosotrosDragOffset(0);
  };

  useEffect(() => {
    if (sponsorPages.length <= 1 || isSponsorsPaused) return;
    const interval = setInterval(() => {
      sponsorCarousel.next();
    }, 3500);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sponsorPages.length, isSponsorsPaused]);
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.12,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const elementsToReveal = document.querySelectorAll('.reveal');
    elementsToReveal.forEach((el) => observer.observe(el));

    return () => {
      elementsToReveal.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="home-container">
      <Seo />
      <GlobalHeader />


      {/* Hero Section */}
      <section className="home-hero theme-dark">
        {/* Cover image (swap public/images/sitio/portada.jpg, or use a video) */}
        <img
          className="home-hero-video"
          src="/images/sitio/portada.jpg"
          alt="Salón de ventas"
        />
        <div className="home-hero-video-overlay"></div>

        <div className="home-hero-content">
          {/* Logo inside the Hero content */}
          <div className="alma-logo-hero">
            <img src="/images/sitio/logo.png" alt="Logo de la concesionaria" />
          </div>
          <h1 className="home-hero-title">Tu Concesionaria</h1>
          <h2 className="home-hero-subtitle">Autos, motos y utilitarios usados. Revisados, con garantía y listos para transferir.</h2>
          <div className="home-hero-actions">
            <Link to="/stock" className="cta-button cta-button--highlight">Ver stock</Link>
            <a href="#contacto" className="cta-button home-hero-secondary">Cotizá tu usado</a>
          </div>
        </div>
      </section>

      {/* NOSOTROS */}
      <section id="nosotros" className="home-section">
        <h2 className="section-title reveal">¿POR QUÉ ELEGIRNOS?</h2>
        <p className="nosotros-intro reveal reveal-delay-1">
          Somos una concesionaria multimarca con años en el rubro. Seleccionamos cada unidad, la revisamos a fondo y te acompañamos en todo el proceso: desde la prueba de manejo hasta la transferencia.
        </p>

        {isNosotrosSlide ? (
          /* Slideshow — mobile ≤640px */
          <div
            className="slideshow-wrapper nosotros-slideshow-wrapper reveal reveal-scale reveal-delay-1"
            onPointerDown={handleNosotrosPointerDown}
            onPointerMove={handleNosotrosPointerMove}
            onPointerUp={handleNosotrosPointerUp}
            onPointerCancel={handleNosotrosPointerUp}
            style={{ touchAction: 'pan-y', cursor: isNosotrosDragging ? 'grabbing' : 'grab' }}
          >
            <button className="slideshow-arrow prev" onClick={() => setCurrentNosotrosIndex((p) => (p - 1 + PILLARS.length) % PILLARS.length)} aria-label="Anterior">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button className="slideshow-arrow next" onClick={() => setCurrentNosotrosIndex((p) => (p + 1) % PILLARS.length)} aria-label="Siguiente">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>

            <div className="slideshow-track-outer">
              <div
                className="slideshow-track"
                style={{
                  transform: `translateX(calc(-${currentNosotrosIndex * 100}% + ${nosotrosDragOffset}px))`,
                  transition: isNosotrosDragging ? 'none' : 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
                  pointerEvents: isNosotrosDragging ? 'none' : 'auto',
                }}
              >
                {PILLARS.map((pillar) => (
                  <div className="slideshow-slide" key={pillar.id}>
                    <div className="nosotros-card nosotros-card--slide">
                      <div className="nosotros-card-header">
                        <div className="nosotros-card-icon">{pillar.icon}</div>
                        <h3 className="nosotros-card-title">{pillar.title}</h3>
                      </div>
                      <p className="nosotros-card-description">{pillar.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="slideshow-dots">
              {PILLARS.map((_, index) => (
                <button
                  key={index}
                  className={`slideshow-dot ${index === currentNosotrosIndex ? 'active' : ''}`}
                  onClick={() => setCurrentNosotrosIndex(index)}
                  aria-label={`Ir a diapositiva ${index + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Grid — desktop >640px */
          <div className="nosotros-grid">
            {PILLARS.map((pillar, i) => (
              <div key={pillar.id} className={`nosotros-card reveal reveal-scale reveal-delay-${i + 1}`}>
                <div className="nosotros-card-header">
                  <div className="nosotros-card-icon">{pillar.icon}</div>
                  <h3 className="nosotros-card-title">{pillar.title}</h3>
                </div>
                <p className="nosotros-card-description">{pillar.description}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <Hero />

      {TABLE_NAMES.map((table, i) => (
        <VehicleSection
          key={table}
          table={table}
          items={tables[table].items}
          loading={tables[table].loading}
          error={tables[table].error}
          altBg={i % 2 === 0}
          autoplay={i === 0}
        />
      ))}

      {/* VER TODO EL STOCK */}
      <section id="stock" className="home-section stock-cta-section theme-dark">
        <div className="ambient-bg"></div>
        <div className="stock-cta reveal reveal-scale">
          <span className="stock-cta-eyebrow">{totalAvailable} unidades disponibles</span>
          <h2 className="stock-cta-title">¿No encontraste lo que buscás?</h2>
          <p className="stock-cta-subtitle">
            Apretá acá abajo y mirá todo nuestro stock de autos, motos y utilitarios en un solo lugar.
          </p>
          <Link to="/stock" className="stock-cta-button">
            Ver todos los vehículos
            <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </Link>

          <div className="stock-cta-categories">
            {TABLE_NAMES.map((table) => (
              <Link key={table} to={`/stock?tipo=${table}`} className="stock-cta-category">
                <span className="stock-cta-category-icon"><CategoryIcon table={table} size={28} /></span>
                <span className="stock-cta-category-label">{TABLE_LABELS[table]}</span>
                <span className="stock-cta-category-count">{availableCount(table)} disponibles</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Marcas */}
      <section className="sponsors-bar">
        <div className="sponsors-inner">
          <div className="sponsors-header reveal reveal-left">
            <h2 className="sponsors-title">Marcas con las que trabajamos</h2>
            <p className="sponsors-subtitle">
              Unidades seleccionadas de las principales marcas del mercado. Si buscás un modelo en particular, te lo conseguimos.
            </p>
            <a href="#contacto" className="cta-button sponsors-cta">Buscame un modelo</a>
          </div>
          <div
            className="sponsors-track-viewport reveal reveal-right reveal-delay-1"
            onMouseEnter={() => setIsSponsorsPaused(true)}
            onMouseLeave={() => setIsSponsorsPaused(false)}
          >
            <div
              className="sponsors-track-slider"
              onTransitionEnd={sponsorCarousel.handleTransitionEnd}
              style={{
                transform: `translateX(-${sponsorCarousel.extIndex * sponsorCarousel.percentPerSlide}%)`,
                transition: !sponsorCarousel.transitionEnabled ? 'none' : 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
              }}
            >
              {sponsorCarousel.renderIndices.map((pageIdx, i) => (
                <div className="sponsors-track" key={`sponsors-page-${pageIdx}-${i}`}>
                  {sponsorPages[pageIdx].map((sponsor) => (
                    <div className="sponsor-item" key={sponsor.id}>
                      {sponsor.url ? (
                        <a href={sponsor.url} target="_blank" rel="noopener noreferrer">
                          <img src={sponsor.imageUrl ?? ''} alt={sponsor.name} className="sponsor-logo" />
                        </a>
                      ) : (
                        <img src={sponsor.imageUrl ?? ''} alt={sponsor.name} className="sponsor-logo" />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="contact-section-wrapper">
        <div className="contact-inner">
          <h2 className="section-title reveal">CONTACTO</h2>
          <div className="contact-container reveal reveal-scale reveal-delay-1">
            {contactSubmitted ? (
              <p className="contact-success">¡Gracias! Recibimos tu mensaje y un asesor te va a contactar a la brevedad.</p>
            ) : (
            <form className="contact-form" onSubmit={handleContactSubmit}>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Nombre"
                  className="form-input"
                  value={contactNombre}
                  onChange={(e) => setContactNombre(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Apellido"
                  className="form-input"
                  value={contactApellido}
                  onChange={(e) => setContactApellido(e.target.value)}
                  required
                />
              </div>
              <div className="form-row">
                <input
                  type="email"
                  placeholder="Email"
                  className="form-input"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                />
                <input
                  type="tel"
                  placeholder="Teléfono / WhatsApp"
                  className="form-input"
                  value={contactTelefono}
                  onChange={(e) => setContactTelefono(e.target.value)}
                  required
                />
              </div>
              <select
                className="form-input"
                value={contactMotivo}
                onChange={(e) => setContactMotivo(e.target.value)}
                required
              >
                <option value="" disabled>Motivo de contacto...</option>
                <option value="unidad">Consulta por una unidad</option>
                <option value="financiacion">Financiación</option>
                <option value="permuta">Vender o permutar mi usado</option>
                <option value="otro">Otro</option>
              </select>
              <textarea
                placeholder="Contanos qué estás buscando (marca, modelo, año, presupuesto...)"
                rows={5}
                className="form-textarea"
                value={contactMensaje}
                onChange={(e) => setContactMensaje(e.target.value)}
                required
              ></textarea>
              {contactError && <p className="contact-error">{contactError}</p>}
              <button type="submit" className="cta-button cta-button--highlight submit-btn" disabled={contactSubmitting}>
                {contactSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
              </button>
            </form>
            )}
          </div>
        </div>
        <AlmaFooter />
        <Footer />
      </section>
    </div>
  );
};
