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
        description="Conocé más sobre el camino y la visión de este proyecto de ejemplo."
        type="article"
      />
      <GlobalHeader />
      <SlidesSection />
    </div>
  );
};
