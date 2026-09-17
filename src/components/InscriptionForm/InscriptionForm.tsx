import React, { useState } from 'react';
import './InscriptionForm.css';

interface InscriptionFormProps {
  table: 'courses' | 'events';
  itemId: string;
  itemTitle: string;
}

// table/itemId aren't used locally — this is a template demo with no backend
// to send them to — but they're kept in the props so callers (ContentDetail)
// can still pass the full context a real inscription would need.
export const InscriptionForm: React.FC<InscriptionFormProps> = ({ itemTitle }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
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
      <div className="inscription-success">
        <p>¡Listo, {firstName}! Recibimos tu inscripción a "{itemTitle}". Te vamos a contactar a {email}.</p>
      </div>
    );
  }

  return (
    <form className="inscription-form" onSubmit={handleSubmit}>
      <h3 className="inscription-form-title">Inscribirse</h3>

      <div className="inscription-form-row">
        <div>
          <label className="inscription-label" htmlFor="insc-first-name">Nombre</label>
          <input
            id="insc-first-name"
            className="inscription-input"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="inscription-label" htmlFor="insc-last-name">Apellido</label>
          <input
            id="insc-last-name"
            className="inscription-input"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <label className="inscription-label" htmlFor="insc-email">Email</label>
        <input
          id="insc-email"
          type="email"
          className="inscription-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="inscription-label" htmlFor="insc-motivo">Motivo</label>
        <input id="insc-motivo" className="inscription-input" value={itemTitle} readOnly disabled />
      </div>

      <div>
        <label className="inscription-label" htmlFor="insc-message">Mensaje (opcional)</label>
        <textarea
          id="insc-message"
          className="inscription-textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <button type="submit" className="inscription-submit" disabled={submitting}>
        {submitting ? 'Enviando...' : 'Enviar inscripción'}
      </button>
    </form>
  );
};
