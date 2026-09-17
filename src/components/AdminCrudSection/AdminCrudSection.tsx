import React, { useState } from 'react';
import { useSupabaseTable } from '../../hooks/useSupabaseTable';
import type { ContentItem, TableName } from '../../types/content';
import '../../pages/admin/admin-shared.css';
import './AdminCrudSection.css';

interface AdminCrudSectionProps {
  table: TableName;
  label: string;
}

interface FormState {
  title: string;
  description: string;
  eventDate: string;
  imageUrl: string;
}

const EMPTY_FORM: FormState = { title: '', description: '', eventDate: '', imageUrl: '' };

export const AdminCrudSection: React.FC<AdminCrudSectionProps> = ({ table, label }) => {
  const { items, loading, error, create, update, remove } = useSupabaseTable(table);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const isFormOpen = isCreating || editingItem !== null;

  const openCreateForm = () => {
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setIsCreating(true);
  };

  const openEditForm = (item: ContentItem) => {
    setIsCreating(false);
    setEditingItem(item);
    setForm({ title: item.title, description: item.description, eventDate: item.eventDate, imageUrl: item.imageUrl ?? '' });
    setFormError(null);
  };

  const closeForm = () => {
    setIsCreating(false);
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!form.imageUrl.trim()) {
      setFormError('Ingresá una URL de imagen.');
      return;
    }

    setSaving(true);
    try {
      const input = {
        title: form.title,
        description: form.description,
        eventDate: form.eventDate,
        imageUrl: form.imageUrl.trim(),
        isFinished: editingItem?.isFinished ?? false,
      };

      if (editingItem) {
        await update(editingItem.id, input);
      } else {
        await create(input);
      }
      closeForm();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Ocurrió un error al guardar.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: ContentItem) => {
    if (!window.confirm(`¿Eliminar "${item.title}"? Esta acción no se puede deshacer.`)) return;
    setDeletingId(item.id);
    try {
      await remove(item.id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleFinished = async (item: ContentItem) => {
    const confirmMessage = item.isFinished
      ? `¿Reactivar "${item.title}"? Va a volver a mostrarse en color y a aceptar inscripciones nuevamente.`
      : `¿Marcar "${item.title}" como finalizado? Va a mostrarse en blanco y negro en la página principal y ya no se van a poder recibir nuevas inscripciones. Podés reactivarlo después si hace falta.`;
    if (!window.confirm(confirmMessage)) return;

    setTogglingId(item.id);
    try {
      await update(item.id, {
        title: item.title,
        description: item.description,
        eventDate: item.eventDate,
        imageUrl: item.imageUrl,
        isFinished: !item.isFinished,
      });
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="admin-crud-section">
      <div className="admin-crud-header">
        <h2 className="admin-crud-title">{label}</h2>
        {!isFormOpen && (
          <button className="admin-btn" onClick={openCreateForm}>Agregar nuevo</button>
        )}
      </div>

      {error && <p className="admin-error">Error al cargar datos: {error}</p>}

      {isFormOpen && (
        <form className="admin-crud-form" onSubmit={handleSubmit}>
          <div>
            <label className="admin-label" htmlFor="crud-title">Título</label>
            <input
              id="crud-title"
              className="admin-input"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="admin-label" htmlFor="crud-description">Descripción</label>
            <textarea
              id="crud-description"
              className="admin-textarea"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="admin-label" htmlFor="crud-date">Fecha</label>
            <input
              id="crud-date"
              type="date"
              className="admin-input"
              value={form.eventDate}
              onChange={(e) => setForm((f) => ({ ...f, eventDate: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="admin-label" htmlFor="crud-image">URL de imagen</label>
            <input
              id="crud-image"
              type="text"
              placeholder="/images/placeholder/card.svg"
              className="admin-input"
              value={form.imageUrl}
              onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
            />
            {form.imageUrl && (
              <img src={form.imageUrl} alt="" className="admin-crud-image-preview" />
            )}
          </div>

          {formError && <p className="admin-error">{formError}</p>}

          <div className="admin-crud-form-actions">
            <button type="submit" className="admin-btn" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
            <button type="button" className="admin-btn admin-btn-secondary" onClick={closeForm} disabled={saving}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="admin-crud-empty">Cargando...</p>
      ) : items.length === 0 ? (
        <p className="admin-crud-empty">Todavía no hay {label.toLowerCase()} cargados.</p>
      ) : (
        <ul className="admin-crud-list">
          {items.map((item) => (
            <li key={item.id} className="admin-crud-list-item">
              {item.imageUrl && <img src={item.imageUrl} alt="" className="admin-crud-thumb" />}
              <div className="admin-crud-item-info">
                <span className="admin-crud-item-title">
                  {item.title}
                  {item.isFinished && <span className="admin-crud-badge">Finalizado</span>}
                </span>
                <span className="admin-crud-item-date">{item.dateTime}</span>
              </div>
              <div className="admin-crud-item-actions">
                {table !== 'news' && (
                  <button
                    className="admin-btn admin-btn-secondary"
                    onClick={() => handleToggleFinished(item)}
                    disabled={isFormOpen || togglingId === item.id}
                  >
                    {togglingId === item.id ? 'Guardando...' : item.isFinished ? 'Reactivar' : 'Marcar finalizado'}
                  </button>
                )}
                <button className="admin-btn" onClick={() => openEditForm(item)} disabled={isFormOpen}>
                  Editar
                </button>
                <button
                  className="admin-btn admin-btn-danger"
                  onClick={() => handleDelete(item)}
                  disabled={isFormOpen || deletingId === item.id}
                >
                  {deletingId === item.id ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
