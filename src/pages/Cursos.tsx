import React from 'react';
import { ContentList } from './ContentList/ContentList';

export const Cursos: React.FC = () => (
  <ContentList
    table="courses"
    pageTitle="CURSOS"
    seoTitle="Cursos"
    seoDescription="Explorá nuestros cursos de ejemplo."
    emptyLabel="Próximamente nuevos cursos."
    ctaLabel="Inscribirse"
    cardPrefix="course"
  />
);
