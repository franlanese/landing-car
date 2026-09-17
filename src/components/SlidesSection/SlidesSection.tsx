import React from 'react';
import { Slide } from '../Slide/Slide';
import { Footer } from '../Footer/Footer';
import { OverlappingImages } from '../OverlappingImages/OverlappingImages';
import './SlidesSection.css';

export const SlidesSection: React.FC = () => {
  const slides = [
    {
      id: 1,
      title: 'Nuestros orígenes',
      description: 'Contá acá cómo empezó tu marca o proyecto: la idea original, el problema que quisiste resolver y los primeros pasos que dieron forma a lo que es hoy.',
      imageUrl: '/images/placeholder/story-1.svg',
      sideElement: <OverlappingImages imageFront="/images/placeholder/story-2.svg" imageBack="/images/placeholder/story-3.svg" />,
      buttonText: 'Ver Entrevistas'
    },
    {
      id: 2,
      title: 'Lo que hacemos hoy',
      description: 'Describí acá el presente de tu marca o proyecto: en qué está trabajando, a quién ayuda y qué la hace distinta hoy en día.',
      imageUrl: '/images/placeholder/story-2.svg',
      sideImage: '/images/placeholder/story-2.svg',
      sideImageLink: '#',
      buttonText: 'Ver sus últimas Publicaciones'
    },
    {
      id: 3,
      title: 'Hacia dónde vamos',
      description: 'Contá acá la visión a futuro: las metas y los próximos pasos que tu marca o proyecto se propone alcanzar.',
      imageUrl: '/images/placeholder/story-3.svg',
      buttonText: 'Ver Mas',
      buttonLink: '#'
    }
  ];

  return (
    <section id="slides-section" className="slides-container">
      {slides.map((slide) => (
        <Slide key={slide.id} {...slide} />
      ))}
      <Footer />
    </section>
  );
};
