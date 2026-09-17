import React from 'react';
import { ContentList } from './ContentList/ContentList';

export const Noticias: React.FC = () => (
  <ContentList
    table="news"
    pageTitle="NOTICIAS"
    seoTitle="Noticias"
    seoDescription="Las últimas noticias de ejemplo."
    emptyLabel="Próximamente nuevas noticias."
    ctaLabel="Leer más"
    cardPrefix="news"
  />
);
