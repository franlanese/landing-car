export type FormSubmissionSource = 'inscription' | 'contact';

export const CONTACT_REASON_LABELS: Record<string, string> = {
  consulta: 'Consulta General',
  curso: 'Inscripción a Cursos',
  evento: 'Eventos',
  alianza: 'Alianza / Patrocinio',
};

export interface FormSubmission {
  id: string;
  source: FormSubmissionSource;
  formLabel: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string | null;
  createdAt: string;
  detailLabel: string;
  detailValue: string;
}
