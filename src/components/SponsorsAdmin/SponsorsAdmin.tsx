import React, { useState } from 'react';
import { useSponsors } from '../../hooks/useSponsors';
import type { Sponsor } from '../../types/sponsor';
import '../../pages/admin/admin-shared.css';
import '../AdminCrudSection/AdminCrudSection.css';
import './SponsorsAdmin.css';

interface FormState {
  name: string;
  url: string;
  imageUrl: string;
}

const EMPTY_FORM: FormState = { name: '', url: '', imageUrl: '' };

export const SponsorsAdmin: React.FC = () => {
  const { items, loading, error, create, update, remove } = useSponsors();
  const [editingItem, setEditingItem] = useState<Sponsor | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isFormOpen = isCreating || editingItem !== null;

  const openCreateForm = () => {
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setIsCreating(true);
  };

  const openEditForm = (item: Sponsor) => {
    setIsCreating(false);
    setEditingItem(item);
    setForm({ name: item.name, url: item.url ?? '', imageUrl: item.imageUrl ?? '' });
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
      const input = { name: form.name, imageUrl: form.imageUrl.trim(), url: form.url.trim() || null };

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

  const handleDelete = async (item: Sponsor) => {
    if (!window.confirm(`¿Eliminar "${item.name}"? Esta acción no se puede deshacer.`)) return;
    setDeletingId(item.id);
    try {
      await remove(item.id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="admin-crud-section">
      <div className="admin-crud-header">
        <h2 className="admin-crud-title">Sponsors</h2>
        {!isFormOpen && (
          <button className="admin-btn" onClick={openCreateForm}>Agregar nuevo</button>
        )}
      </div>

      {error && <p className="admin-error">Error al cargar datos: {error}</p>}

      {isFormOpen && (
        <form className="admin-crud-form" onSubmit={handleSubmit}>
          <div>
            <label className="admin-label" htmlFor="sponsor-name">Nombre</label>
            <input
              id="sponsor-name"
              className="admin-input"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="admin-label" htmlFor="sponsor-url">URL (opcional)</label>
            <input
              id="sponsor-url"
              type="url"
              className="admin-input"
              placeholder="https://..."
              value={form.url}
              onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
            />
          </div>
          <div>
            <label className="admin-label" htmlFor="sponsor-image">URL de imagen</label>
            <input
              id="sponsor-image"
              type="text"
              placeholder="/images/placeholder/sponsor.svg"
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
        <p className="admin-crud-empty">Todavía no hay sponsors cargados.</p>
      ) : (
        <ul className="admin-crud-list">
          {items.map((item) => (
            <li key={item.id} className="admin-crud-list-item">
              {item.imageUrl && <img src={item.imageUrl} alt="" className="admin-crud-thumb sponsors-admin-thumb" />}
              <div className="admin-crud-item-info">
                <span className="admin-crud-item-title">{item.name}</span>
                {item.url && <span className="admin-crud-item-date">{item.url}</span>}
              </div>
              <div className="admin-crud-item-actions">
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
