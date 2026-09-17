import React, { useState } from 'react';
import { useFormSubmissions } from '../../hooks/useFormSubmissions';
import '../../pages/admin/admin-shared.css';
import './FormSubmissionsAdmin.css';

function formatDateTimeEs(iso: string): string {
  const date = new Date(iso);
  const datePart = date.toLocaleDateString('es-AR');
  const timePart = date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  return `${datePart} ${timePart}`;
}

export const FormSubmissionsAdmin: React.FC = () => {
  const { submissions, loading, error } = useFormSubmissions();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  return (
    <div className="admin-crud-section">
      <div className="admin-crud-header">
        <h2 className="admin-crud-title">Formularios</h2>
      </div>

      {error && <p className="admin-error">Error al cargar datos: {error}</p>}

      {loading ? (
        <p className="admin-crud-empty">Cargando...</p>
      ) : submissions.length === 0 ? (
        <p className="admin-crud-empty">Todavía no hay formularios completados.</p>
      ) : (
        <div className="forms-admin-table-wrapper">
          <table className="forms-admin-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Formulario</th>
                <th>Nombre</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <React.Fragment key={submission.id}>
                  <tr
                    className={`forms-admin-row ${expandedId === submission.id ? 'active' : ''}`}
                    onClick={() => toggleRow(submission.id)}
                  >
                    <td>{formatDateTimeEs(submission.createdAt)}</td>
                    <td>{submission.formLabel}</td>
                    <td>{submission.firstName} {submission.lastName}</td>
                    <td>{submission.email}</td>
                  </tr>
                  {expandedId === submission.id && (
                    <tr className="forms-admin-detail-row">
                      <td colSpan={4}>
                        <dl className="forms-admin-detail">
                          <dt>Nombre completo</dt>
                          <dd>{submission.firstName} {submission.lastName}</dd>
                          <dt>Email</dt>
                          <dd>{submission.email}</dd>
                          <dt>{submission.detailLabel}</dt>
                          <dd>{submission.detailValue}</dd>
                          <dt>Mensaje</dt>
                          <dd>{submission.message || '—'}</dd>
                          <dt>Fecha</dt>
                          <dd>{formatDateTimeEs(submission.createdAt)}</dd>
                        </dl>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
