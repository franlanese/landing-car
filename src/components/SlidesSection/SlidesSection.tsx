import React from 'react';
import { Slide } from '../Slide/Slide';
import { Footer } from '../Footer/Footer';
import { OverlappingImages } from '../OverlappingImages/OverlappingImages';
import './SlidesSection.css';

export const SlidesSection: React.FC = () => {
  const slides = [
    {
      id: 1,
      title: 'Más de 20 años en el rubro',
      description: 'Empezamos como una agencia chica de barrio, vendiendo los autos de los vecinos. Hoy somos una concesionaria multimarca, pero seguimos trabajando igual: con la palabra y dando la cara por cada unidad que vendemos.',
      imageUrl: '/images/sitio/historia-1.jpg',
      sideElement: <OverlappingImages imageFront="/images/sitio/historia-2.jpg" imageBack="/images/sitio/historia-3.jpg" />,
      buttonText: 'Conocé al equipo'
    },
    {
      id: 2,
      title: 'Cada unidad, revisada',
      description: 'Antes de publicar un vehículo lo pasamos por una revisión de más de 100 puntos: motor, tren delantero, frenos, chapa y documentación. Si no pasa la revisión, no sale a la venta.',
      imageUrl: '/images/sitio/historia-2.jpg',
      sideImage: '/images/sitio/historia-2.jpg',
      sideImageLink: '#',
      buttonText: 'Cómo revisamos'
    },
    {
      id: 3,
      title: 'Lo que viene',
      description: 'Estamos ampliando el salón de ventas y sumando un taller propio de preparación, para entregarte cada unidad como nueva.',
      imageUrl: '/images/sitio/historia-3.jpg',
      buttonText: 'Seguinos',
      buttonLink: '#'
    }
  ];

  return (
    <section id="slides-section" className="slides-container theme-dark">
      {slides.map((slide) => (
        <Slide key={slide.id} {...slide} />
      ))}
      <Footer />
    </section>
  );
};
