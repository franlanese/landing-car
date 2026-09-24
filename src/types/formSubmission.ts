export type FormSubmissionSource = 'inquiry' | 'contact';

export const CONTACT_REASON_LABELS: Record<string, string> = {
  unidad: 'Consulta por una unidad',
  financiacion: 'Financiación',
  permuta: 'Vender o permutar mi usado',
  otro: 'Otro',
};

export interface FormSubmission {
  id: string;
  source: FormSubmissionSource;
  formLabel: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  message: string | null;
  createdAt: string;
  detailLabel: string;
  detailValue: string;
}
