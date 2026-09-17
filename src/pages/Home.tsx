import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { AlmaFooter } from '../components/AlmaFooter/AlmaFooter';
import { Footer } from '../components/Footer/Footer';
import { GlobalHeader } from '../components/GlobalHeader/GlobalHeader';
import { Seo } from '../components/Seo/Seo';
import './Home.css';
import { Hero } from '../components/Hero/Hero';
import { useSupabaseTable } from '../hooks/useSupabaseTable';
import { useSponsors } from '../hooks/useSponsors';
import { useInfiniteCarousel } from '../hooks/useInfiniteCarousel';

interface Pillar {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const PILLARS: Pillar[] = [
  {
    id: 1,
    title: "Pilar uno",
    description: "Descripción breve de este pilar de ejemplo, reemplazala por tu propio contenido.",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    id: 2,
    title: "Pilar dos",
    description: "Descripción breve de este pilar de ejemplo, reemplazala por tu propio contenido.",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
      </svg>
    ),
  },
  {
    id: 3,
    title: "Pilar tres",
    description: "Descripción breve de este pilar de ejemplo, reemplazala por tu propio contenido.",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="1"/>
        <path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5z"/>
        <path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5z"/>
      </svg>
    ),
  },
  {
    id: 4,
    title: "Pilar cuatro",
    description: "Descripción breve de este pilar de ejemplo, reemplazala por tu propio contenido.",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
];

export const Home: React.FC = () => {
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isNosotrosSlide, setIsNosotrosSlide] = useState(window.innerWidth <= 640);

  const { items: sponsors } = useSponsors();
  const { items: allCourses, loading: coursesLoading, error: coursesError } = useSupabaseTable('courses');
  const { items: allEvents, loading: eventsLoading, error: eventsError } = useSupabaseTable('events');
  const { items: allNews, loading: newsLoading, error: newsError } = useSupabaseTable('news');

  // Home only previews the 4 most recent of each; the full lists live on
  // their own pages (/cursos, /eventos, /noticias).
  const courses = allCourses.slice(-4);
  const events = allEvents.slice(-4);
  const news = allNews.slice(-4);

  const cardsPerView = isMobile ? 1 : 2;
  // Math.max(..., 1) keeps useInfiniteCarousel's modulo math safe while data
  // is still loading (empty array); the loading skeleton is rendered instead
  // of the carousel markup until items actually arrive, so index 0 is never
  // read from an empty items array.
  const courseCarousel = useInfiniteCarousel(Math.max(courses.length, 1), cardsPerView);
  const eventCarousel = useInfiniteCarousel(Math.max(events.length, 1), cardsPerView);
  const newsCarousel = useInfiniteCarousel(Math.max(news.length, 1), cardsPerView);

  // Sponsors show as a static 2x2 grid when there are 4 or fewer; beyond
  // that, they're paginated into 2x2 "pages" and treated as a 1-per-view
  // infinite carousel (reusing the same clone-padded loop as the other
  // sections) so it auto-advances seamlessly with no visible rewind.
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

  // Drag states for Courses
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  // Drag states for Events
  const [isEventDragging, setIsEventDragging] = useState(false);
  const [eventDragStartX, setEventDragStartX] = useState(0);
  const [eventDragOffset, setEventDragOffset] = useState(0);

  // Drag states for News
  const [isNewsDragging, setIsNewsDragging] = useState(false);
  const [newsDragStartX, setNewsDragStartX] = useState(0);
  const [newsDragOffset, setNewsDragOffset] = useState(0);

  // States and Drag states for Nosotros pillars
  const [currentNosotrosIndex, setCurrentNosotrosIndex] = useState(0);
  const [isNosotrosDragging, setIsNosotrosDragging] = useState(false);
  const [nosotrosDragStartX, setNosotrosDragStartX] = useState(0);
  const [nosotrosDragOffset, setNosotrosDragOffset] = useState(0);

  // Form states
  const [contactNombre, setContactNombre] = useState("");
  const [contactApellido, setContactApellido] = useState("");
  const [contactEmail, setContactEmail] = useState("");
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
    setContactMotivo("");
    setContactMensaje("");
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
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

  // Courses drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest('button, a')) return;
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragOffset(0);
    setIsAutoplayPaused(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const diff = currentX - dragStartX;
    setDragOffset(diff);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);

    const threshold = 60;
    if (dragOffset < -threshold) {
      courseCarousel.next();
    } else if (dragOffset > threshold) {
      courseCarousel.prev();
    }

    setDragOffset(0);
    setIsAutoplayPaused(false);
  };

  // Events drag handlers
  const handleEventPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest('button, a')) return;
    setIsEventDragging(true);
    setEventDragStartX(e.clientX);
    setEventDragOffset(0);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleEventPointerMove = (e: React.PointerEvent) => {
    if (!isEventDragging) return;
    const currentX = e.clientX;
    const diff = currentX - eventDragStartX;
    setEventDragOffset(diff);
  };

  const handleEventPointerUp = (e: React.PointerEvent) => {
    if (!isEventDragging) return;
    setIsEventDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);

    const threshold = 60;
    if (eventDragOffset < -threshold) {
      eventCarousel.next();
    } else if (eventDragOffset > threshold) {
      eventCarousel.prev();
    }

    setEventDragOffset(0);
  };

  // News drag handlers
  const handleNewsPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest('button, a')) return;
    setIsNewsDragging(true);
    setNewsDragStartX(e.clientX);
    setNewsDragOffset(0);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleNewsPointerMove = (e: React.PointerEvent) => {
    if (!isNewsDragging) return;
    const currentX = e.clientX;
    const diff = currentX - newsDragStartX;
    setNewsDragOffset(diff);
  };

  const handleNewsPointerUp = (e: React.PointerEvent) => {
    if (!isNewsDragging) return;
    setIsNewsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);

    const threshold = 60;
    if (newsDragOffset < -threshold) {
      newsCarousel.next();
    } else if (newsDragOffset > threshold) {
      newsCarousel.prev();
    }

    setNewsDragOffset(0);
  };

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
    if (isAutoplayPaused) return;
    const interval = setInterval(() => {
      courseCarousel.next();
    }, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAutoplayPaused]);
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
      <section className="home-hero">
        <div className="stars-bg"></div>

        {/* Hero background image (swap for your own image or video) */}
        <img
          className="home-hero-video"
          src="/images/placeholder/hero.svg"
          alt="Imagen de portada"
        />
        <div className="home-hero-video-overlay"></div>

        <div className="home-hero-content">
          {/* Logo inside the Hero content */}
          <div className="alma-logo-hero">
            <img src="/images/placeholder/logo.svg" alt="Logo de tu marca" />
          </div>
          <h1 className="home-hero-title">Tu Marca</h1>
          <h2 className="home-hero-subtitle">Una plantilla de landing page lista para personalizar.</h2>
        </div>
      </section>

      {/* NOSOTROS */}
      <section id="nosotros" className="home-section">
        <h2 className="section-title reveal">NOSOTROS</h2>
        <p className="nosotros-intro reveal reveal-delay-1">
          Contá acá de qué se trata tu marca o proyecto: quiénes son, qué hacen y por qué le importa a quien los visita.
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

      {/* CURSOS */}
      <section id="cursos" className="home-section alt-bg">
        <div className="stars-bg"></div>
        <h2 className="section-title reveal">CURSOS</h2>

        {coursesLoading || courses.length === 0 ? (
        <div className="content-loading reveal reveal-scale reveal-delay-1">
          {coursesLoading ? 'Cargando cursos...' : coursesError ? `Error al cargar cursos: ${coursesError}` : 'Próximamente nuevos cursos.'}
        </div>
        ) : (
        <div
          className="slideshow-wrapper reveal reveal-scale reveal-delay-1"
          onMouseEnter={() => setIsAutoplayPaused(true)}
          onMouseLeave={() => setIsAutoplayPaused(false)}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ touchAction: 'pan-y', cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          {/* Controls */}
          <button className="slideshow-arrow prev" onClick={courseCarousel.prev} aria-label="Anterior">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>

          <button className="slideshow-arrow next" onClick={courseCarousel.next} aria-label="Siguiente">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>

          {/* Slides Track Outer */}
          <div className="slideshow-track-outer">
            <div
              className="slideshow-track"
              onTransitionEnd={courseCarousel.handleTransitionEnd}
              style={{
                transform: `translateX(calc(-${courseCarousel.extIndex * courseCarousel.percentPerSlide}% + ${dragOffset}px))`,
                transition: (isDragging || !courseCarousel.transitionEnabled) ? 'none' : 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
                pointerEvents: isDragging ? 'none' : 'auto'
              }}
            >
              {courseCarousel.renderIndices.map((courseIdx, i) => {
                const course = courses[courseIdx];
                return (
                  <div className="slideshow-slide" key={`${course.id}-${i}`}>
                    <div className={`course-card ${course.isFinished ? 'is-finished' : ''}`}>
                      <div className="course-image-wrapper">
                        <img src={course.imageUrl ?? ''} alt={course.title} className="course-image" draggable="false" />
                        <div className="course-image-overlay"></div>
                      </div>
                      <div className="course-content">
                        <span className="course-date-badge">
                          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="clock-icon"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                          {course.dateTime}
                        </span>
                        <h3 className="course-title">{course.title}</h3>
                        <p className="course-description">{course.description}</p>
                        <Link className="cta-button course-enroll-btn" to={`/cursos/${course.id}`}>
                          Inscribirse
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dots Indicators */}
          <div className="slideshow-dots">
            {Array.from({ length: courseCarousel.total }).map((_, index) => (
              <button
                key={index}
                className={`slideshow-dot ${index === courseCarousel.activeDot ? 'active' : ''}`}
                onClick={() => courseCarousel.goToReal(index)}
                aria-label={`Ir a diapositiva ${index + 1}`}
              />
            ))}
          </div>
        </div>
        )}

        <div className="section-view-all">
          <Link to="/cursos" className="cta-button">Ver todos los cursos</Link>
        </div>
      </section>

      {/* EVENTOS */}
      <section id="eventos" className="home-section">
        <div className="stars-bg"></div>
        <h2 className="section-title reveal">EVENTOS</h2>

        {eventsLoading || events.length === 0 ? (
        <div className="content-loading reveal reveal-scale reveal-delay-1">
          {eventsLoading ? 'Cargando eventos...' : eventsError ? `Error al cargar eventos: ${eventsError}` : 'Próximamente nuevos eventos.'}
        </div>
        ) : (
        <div
          className="slideshow-wrapper reveal reveal-scale reveal-delay-1"
          onPointerDown={handleEventPointerDown}
          onPointerMove={handleEventPointerMove}
          onPointerUp={handleEventPointerUp}
          onPointerCancel={handleEventPointerUp}
          style={{ touchAction: 'pan-y', cursor: isEventDragging ? 'grabbing' : 'grab' }}
        >
          {/* Controls */}
          <button className="slideshow-arrow prev" onClick={eventCarousel.prev} aria-label="Anterior">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>

          <button className="slideshow-arrow next" onClick={eventCarousel.next} aria-label="Siguiente">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>

          {/* Slides Track Outer */}
          <div className="slideshow-track-outer">
            <div
              className="slideshow-track"
              onTransitionEnd={eventCarousel.handleTransitionEnd}
              style={{
                transform: `translateX(calc(-${eventCarousel.extIndex * eventCarousel.percentPerSlide}% + ${eventDragOffset}px))`,
                transition: (isEventDragging || !eventCarousel.transitionEnabled) ? 'none' : 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
                pointerEvents: isEventDragging ? 'none' : 'auto'
              }}
            >
              {eventCarousel.renderIndices.map((eventIdx, i) => {
                const event = events[eventIdx];
                return (
                  <div className="slideshow-slide" key={`${event.id}-${i}`}>
                    <div className={`event-card ${event.isFinished ? 'is-finished' : ''}`}>
                      <div className="event-image-wrapper">
                        <img src={event.imageUrl ?? ''} alt={event.title} className="event-image" draggable="false" />
                        <div className="event-image-overlay"></div>
                      </div>
                      <div className="event-content">
                        <span className="event-date-badge">
                          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="clock-icon"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                          {event.dateTime}
                        </span>
                        <h3 className="event-title">{event.title}</h3>
                        <p className="event-description">{event.description}</p>
                        <Link className="cta-button event-enroll-btn" to={`/eventos/${event.id}`}>
                          Inscribirse
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dots Indicators */}
          <div className="slideshow-dots">
            {Array.from({ length: eventCarousel.total }).map((_, index) => (
              <button
                key={index}
                className={`slideshow-dot ${index === eventCarousel.activeDot ? 'active' : ''}`}
                onClick={() => eventCarousel.goToReal(index)}
                aria-label={`Ir a diapositiva ${index + 1}`}
              />
            ))}
          </div>
        </div>
        )}

        <div className="section-view-all">
          <Link to="/eventos" className="cta-button">Ver todos los eventos</Link>
        </div>
      </section>

      {/* NOTICIAS */}
      <section id="noticias" className="home-section alt-bg">
        <div className="stars-bg"></div>
        <h2 className="section-title reveal">NOTICIAS</h2>

        {newsLoading || news.length === 0 ? (
        <div className="content-loading reveal reveal-scale reveal-delay-1">
          {newsLoading ? 'Cargando noticias...' : newsError ? `Error al cargar noticias: ${newsError}` : 'Próximamente nuevas noticias.'}
        </div>
        ) : (
        <div
          className="slideshow-wrapper reveal reveal-scale reveal-delay-1"
          onPointerDown={handleNewsPointerDown}
          onPointerMove={handleNewsPointerMove}
          onPointerUp={handleNewsPointerUp}
          onPointerCancel={handleNewsPointerUp}
          style={{ touchAction: 'pan-y', cursor: isNewsDragging ? 'grabbing' : 'grab' }}
        >
          {/* Controls */}
          <button className="slideshow-arrow prev" onClick={newsCarousel.prev} aria-label="Anterior">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>

          <button className="slideshow-arrow next" onClick={newsCarousel.next} aria-label="Siguiente">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>

          {/* Slides Track Outer */}
          <div className="slideshow-track-outer">
            <div
              className="slideshow-track"
              onTransitionEnd={newsCarousel.handleTransitionEnd}
              style={{
                transform: `translateX(calc(-${newsCarousel.extIndex * newsCarousel.percentPerSlide}% + ${newsDragOffset}px))`,
                transition: (isNewsDragging || !newsCarousel.transitionEnabled) ? 'none' : 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
                pointerEvents: isNewsDragging ? 'none' : 'auto'
              }}
            >
              {newsCarousel.renderIndices.map((newsIdx, i) => {
                const newsItem = news[newsIdx];
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

          {/* Dots Indicators */}
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
        )}

        <div className="section-view-all">
          <Link to="/noticias" className="cta-button">Ver todas las noticias</Link>
        </div>
      </section>

      {/* Sponsors Bar */}
      <section className="sponsors-bar">
        <div className="sponsors-inner">
          <div className="sponsors-header reveal reveal-left">
            <h2 className="sponsors-title">Partners & Sponsors</h2>
            <p className="sponsors-subtitle">
              Estas son algunas de las organizaciones que confían en nosotros.
            </p>
            <a href="#contacto" className="cta-button sponsors-cta">Quiero ser sponsor</a>
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
              <p className="contact-success">¡Gracias! Recibimos tu mensaje y te vamos a contactar a la brevedad.</p>
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
              <input
                type="email"
                placeholder="Email"
                className="form-input"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
              />
              <select
                className="form-input"
                value={contactMotivo}
                onChange={(e) => setContactMotivo(e.target.value)}
                required
              >
                <option value="" disabled>Motivo de contacto...</option>
                <option value="consulta">Consulta General</option>
                <option value="curso">Inscripción a Cursos</option>
                <option value="evento">Eventos</option>
                <option value="alianza">Alianza / Patrocinio</option>
              </select>
              <textarea
                placeholder="Mensaje"
                rows={5}
                className="form-textarea"
                value={contactMensaje}
                onChange={(e) => setContactMensaje(e.target.value)}
                required
              ></textarea>
              {contactError && <p className="contact-error">{contactError}</p>}
              <button type="submit" className="cta-button submit-btn" disabled={contactSubmitting}>
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
