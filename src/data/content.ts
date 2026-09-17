import { rowToItem, type ContentRow } from '../lib/contentMapping';
import type { ContentItem, TableName } from '../types/content';

// Static example content for the template. Shape matches what
// `rowToItem` (src/lib/contentMapping.ts) used to produce from a Supabase
// row, so the mapping logic stays reusable even without a real backend.

const PLACEHOLDER_CARD = '/images/placeholder/card.svg';

const courseRows: ContentRow[] = [
  {
    id: 'course-1',
    title: 'Curso de ejemplo 1',
    description:
      'Descripción breve de ejemplo para este curso de muestra que podés reemplazar por tu propio contenido.',
    event_date: '2026-03-15',
    image_url: PLACEHOLDER_CARD,
    is_finished: false,
  },
  {
    id: 'course-2',
    title: 'Curso de ejemplo 2',
    description:
      'Descripción breve de ejemplo para este curso de muestra que podés reemplazar por tu propio contenido.',
    event_date: '2026-05-02',
    image_url: PLACEHOLDER_CARD,
    is_finished: false,
  },
  {
    id: 'course-3',
    title: 'Curso de ejemplo 3',
    description:
      'Descripción breve de ejemplo para este curso de muestra que podés reemplazar por tu propio contenido.',
    event_date: '2026-08-20',
    image_url: PLACEHOLDER_CARD,
    is_finished: false,
  },
];

const eventRows: ContentRow[] = [
  {
    id: 'event-1',
    title: 'Evento de ejemplo 1',
    description:
      'Descripción breve de ejemplo para este evento de muestra que podés reemplazar por tu propio contenido.',
    event_date: '2026-04-10',
    image_url: PLACEHOLDER_CARD,
    is_finished: false,
  },
  {
    id: 'event-2',
    title: 'Evento de ejemplo 2',
    description:
      'Descripción breve de ejemplo para este evento de muestra que podés reemplazar por tu propio contenido.',
    event_date: '2026-06-18',
    image_url: PLACEHOLDER_CARD,
    is_finished: false,
  },
  {
    id: 'event-3',
    title: 'Evento de ejemplo 3',
    description:
      'Descripción breve de ejemplo para este evento de muestra que podés reemplazar por tu propio contenido.',
    event_date: '2026-09-05',
    image_url: PLACEHOLDER_CARD,
    is_finished: false,
  },
];

const newsRows: ContentRow[] = [
  {
    id: 'news-1',
    title: 'Noticia de ejemplo 1',
    description:
      'Descripción breve de ejemplo para esta noticia de muestra que podés reemplazar por tu propio contenido.',
    event_date: '2026-02-01',
    image_url: PLACEHOLDER_CARD,
    is_finished: false,
  },
  {
    id: 'news-2',
    title: 'Noticia de ejemplo 2',
    description:
      'Descripción breve de ejemplo para esta noticia de muestra que podés reemplazar por tu propio contenido.',
    event_date: '2026-03-28',
    image_url: PLACEHOLDER_CARD,
    is_finished: false,
  },
  {
    id: 'news-3',
    title: 'Noticia de ejemplo 3',
    description:
      'Descripción breve de ejemplo para esta noticia de muestra que podés reemplazar por tu propio contenido.',
    event_date: '2026-07-11',
    image_url: PLACEHOLDER_CARD,
    is_finished: false,
  },
];

export const INITIAL_CONTENT: Record<TableName, ContentItem[]> = {
  courses: courseRows.map(rowToItem),
  events: eventRows.map(rowToItem),
  news: newsRows.map(rowToItem),
};
