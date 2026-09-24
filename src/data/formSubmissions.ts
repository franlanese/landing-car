import { CONTACT_REASON_LABELS, type FormSubmission } from '../types/formSubmission';

// Static example form submissions, so the admin "Formularios" tab has
// sample content to show. Not backed by any real form — the public forms
// (InquiryForm, Home contact form) don't write here.
export const INITIAL_FORM_SUBMISSIONS: FormSubmission[] = [
  {
    id: 'submission-1',
    source: 'inquiry',
    formLabel: 'Consulta: Toyota Corolla 2.0 XEI CVT',
    firstName: 'Juana',
    lastName: 'Pérez',
    email: 'juana.perez@example.com',
    phone: '11 5555-0101',
    message: '¿Aceptan permuta por un Gol Trend 2016? ¿Qué opciones de financiación tienen?',
    createdAt: '2026-09-20T14:30:00.000Z',
    detailLabel: 'Unidad',
    detailValue: 'Toyota Corolla 2.0 XEI CVT',
  },
  {
    id: 'submission-2',
    source: 'contact',
    formLabel: 'Contacto',
    firstName: 'Martín',
    lastName: 'Gómez',
    email: 'martin.gomez@example.com',
    phone: '11 5555-0102',
    message: 'Quiero cotizar mi Ford Ka 2019 con 60.000 km para entregarlo como parte de pago.',
    createdAt: '2026-09-21T09:15:00.000Z',
    detailLabel: 'Motivo',
    detailValue: CONTACT_REASON_LABELS.permuta,
  },
  {
    id: 'submission-3',
    source: 'inquiry',
    formLabel: 'Consulta: Honda CB 250 Twister',
    firstName: 'Lucía',
    lastName: 'Fernández',
    email: 'lucia.fernandez@example.com',
    phone: null,
    message: null,
    createdAt: '2026-09-22T18:45:00.000Z',
    detailLabel: 'Unidad',
    detailValue: 'Honda CB 250 Twister',
  },
  {
    id: 'submission-4',
    source: 'inquiry',
    formLabel: 'Consulta: Toyota Hilux SRV 2.8 4x4 AT',
    firstName: 'Diego',
    lastName: 'Ramírez',
    email: 'diego.ramirez@example.com',
    phone: '351 555-0104',
    message: '¿Tiene los services oficiales? Me interesa financiar una parte.',
    createdAt: '2026-09-23T11:05:00.000Z',
    detailLabel: 'Unidad',
    detailValue: 'Toyota Hilux SRV 2.8 4x4 AT',
  },
];
