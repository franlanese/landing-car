import React, { useState } from 'react';
import type { TableName } from '../../types/content';
import './InquiryForm.css';

interface InquiryFormProps {
  table: TableName;
  itemId: string;
  itemTitle: string;
}

// table/itemId aren't used locally — this is a template demo with no backend
// to send them to — but they're kept in the props so callers (ContentDetail)
// can still pass the full context a real inquiry would need.
export const InquiryForm: React.FC<InquiryFormProps> = ({ itemTitle }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Template demo: there's no backend, so this just shows the same success
  // feedback the real form would after a successful insert. Nothing is sent
  // or persisted anywhere.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="inquiry-success">
        <p>
          ¡Gracias, {firstName}! Recibimos tu consulta por "{itemTitle}". Un asesor te va a contactar a la brevedad
          al {phone} o a {email}.
        </p>
      </div>
    );
  }

  return (
    <form className="inquiry-form" onSubmit={handleSubmit}>
      <h3 className="inquiry-form-title">Consultar por esta unidad</h3>

      <div className="inquiry-form-row">
        <div>
          <label className="inquiry-label" htmlFor="inq-first-name">Nombre</label>
          <input
            id="inq-first-name"
            className="inquiry-input"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="inquiry-label" htmlFor="inq-last-name">Apellido</label>
          <input
            id="inq-last-name"
            className="inquiry-input"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="inquiry-form-row">
        <div>
          <label className="inquiry-label" htmlFor="inq-email">Email</label>
          <input
            id="inq-email"
            type="email"
            className="inquiry-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="inquiry-label" htmlFor="inq-phone">Teléfono / WhatsApp</label>
          <input
            id="inq-phone"
            type="tel"
            className="inquiry-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <label className="inquiry-label" htmlFor="inq-unit">Unidad</label>
        <input id="inq-unit" className="inquiry-input" value={itemTitle} readOnly disabled />
      </div>

      <div>
        <label className="inquiry-label" htmlFor="inq-message">Mensaje (opcional)</label>
        <textarea
          id="inq-message"
          className="inquiry-textarea"
          placeholder="Ej: ¿Aceptan permuta? ¿Qué opciones de financiación hay?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <button type="submit" className="inquiry-submit" disabled={submitting}>
        {submitting ? 'Enviando...' : 'Enviar consulta'}
      </button>
    </form>
  );
};
