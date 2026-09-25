import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Hero.css';

export const Hero: React.FC = () => {
  const [showArrow, setShowArrow] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let observer: IntersectionObserver;

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setIsVisible(true);
        clearTimeout(timer);
        timer = setTimeout(() => {
          setShowArrow(true);
        }, 10000);
      } else {
        setIsVisible(false);
        setShowArrow(false);
        clearTimeout(timer);
      }
    };

    const handleScroll = () => {
      setShowArrow(false);
      clearTimeout(timer);
    };

    if (sectionRef.current) {
      observer = new IntersectionObserver(handleIntersection, {
        threshold: 0.25 // Trigger animation slightly earlier when 25% of section is visible
      });
      observer.observe(sectionRef.current);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      if (observer) observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSlides = () => {
    setShowArrow(false); // Force hide immediately
    const slidesElement = document.getElementById('slides-section');
    if (slidesElement) {
      slidesElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/historia');
    }
  };

  return (
    <section className={`hero theme-dark ${isVisible ? 'animate-in' : ''}`} ref={sectionRef}>
      <div className="hero-container">
        <div className="hero-text">
          <h1 className="hero-title">Tomamos tu usado</h1>
          <p className="hero-subtitle">Lo cotizamos en el momento y lo tomamos como parte de pago. La diferencia, en cuotas fijas.</p>
          <Link to="/#contacto" className="cta-button cta-button--highlight">
            Cotizá tu usado
          </Link>
        </div>
        <div className="hero-image">
          <div className="hero-img-frame">
            <img src="/images/sitio/tomamos-tu-usado.png" alt="Tomamos tu usado como parte de pago" className="hero-img" />
          </div>
        </div>
      </div>
      <div className={`scroll-arrow ${showArrow ? 'visible' : ''}`} onClick={scrollToSlides}>
        <div className="arrow-icon"></div>
      </div>
    </section>
  );
};
