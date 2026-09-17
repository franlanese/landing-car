import type { FormSubmission } from '../types/formSubmission';

// Static example form submissions, so the admin "Formularios" tab has
// sample content to show. Not backed by any real form — the public forms
// (InscriptionForm, Home contact form) don't write here.
export const INITIAL_FORM_SUBMISSIONS: FormSubmission[] = [
  {
    id: 'submission-1',
    source: 'inscription',
    formLabel: 'Curso: Curso de ejemplo 1',
    firstName: 'Juana',
    lastName: 'Pérez',
    email: 'juana.perez@example.com',
    message: 'Me interesa mucho este curso, ¿hay cupos disponibles?',
    createdAt: '2026-01-20T14:30:00.000Z',
    detailLabel: 'Curso',
    detailValue: 'Curso de ejemplo 1',
  },
  {
    id: 'submission-2',
    source: 'contact',
    formLabel: 'Contacto',
    firstName: 'Martín',
    lastName: 'Gómez',
    email: 'martin.gomez@example.com',
    message: 'Quisiera más información sobre cómo sumarme como sponsor.',
    createdAt: '2026-02-03T09:15:00.000Z',
    detailLabel: 'Motivo',
    detailValue: 'Alianza / Patrocinio',
  },
  {
    id: 'submission-3',
    source: 'inscription',
    formLabel: 'Evento: Evento de ejemplo 1',
    firstName: 'Lucía',
    lastName: 'Fernández',
    email: 'lucia.fernandez@example.com',
    message: null,
    createdAt: '2026-02-10T18:45:00.000Z',
    detailLabel: 'Evento',
    detailValue: 'Evento de ejemplo 1',
  },
];
