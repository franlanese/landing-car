import React, { useEffect } from 'react';
import { GlobalHeader } from '../components/GlobalHeader/GlobalHeader';
import { SlidesSection } from '../components/SlidesSection/SlidesSection';
import { Seo } from '../components/Seo/Seo';

export const Historia: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.documentElement.classList.add('scroll-snap-active');
    return () => {
      document.documentElement.classList.remove('scroll-snap-active');
    };
  }, []);

  return (
    <div className="historia-page">
      <Seo
        title="Nuestra Historia"
        description="Más de 20 años vendiendo autos, motos y utilitarios usados. Conocé cómo trabajamos y cómo revisamos cada unidad."
        type="article"
      />
      <GlobalHeader />
      <SlidesSection />
    </div>
  );
};
