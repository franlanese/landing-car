import React from 'react';
import { ContentList } from './ContentList/ContentList';

export const Eventos: React.FC = () => (
  <ContentList
    table="events"
    pageTitle="EVENTOS"
    seoTitle="Eventos"
    seoDescription="Enterate de los próximos eventos."
    emptyLabel="Próximamente nuevos eventos."
    ctaLabel="Inscribirse"
    cardPrefix="event"
  />
);
