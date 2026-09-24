import React, { useState } from 'react';
import { useSupabaseTable, type ContentItemInput } from '../../hooks/useSupabaseTable';
import { formatDateEs, formatKm, formatPrice } from '../../lib/contentMapping';
import type { ContentItem, TableName } from '../../types/content';
import '../../pages/admin/admin-shared.css';
import './AdminCrudSection.css';

interface AdminCrudSectionProps {
  table: TableName;
  label: string;
}

// Number fields are kept as strings while editing so the inputs can be
// cleared; they're parsed on submit.
interface FormState {
  title: string;
  description: string;
  year: string;
  km: string;
  price: string;
  publishedAt: string;
  imageUrl: string;
}

const EMPTY_FORM: FormState = { title: '', description: '', year: '', km: '', price: '', publishedAt: '', imageUrl: '' };

const MAX_YEAR = new Date().getFullYear() + 1;

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
    setForm({
      title: item.title,
      description: item.description,
      year: String(item.year),
      km: String(item.km),
      price: String(item.price),
      publishedAt: item.publishedAt,
      imageUrl: item.imageUrl ?? '',
    });
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
      const input: ContentItemInput = {
        title: form.title,
        description: form.description,
        publishedAt: form.publishedAt,
        imageUrl: form.imageUrl.trim(),
        isSold: editingItem?.isSold ?? false,
        year: Number(form.year),
        km: Number(form.km),
        price: Number(form.price),
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

  const handleToggleSold = async (item: ContentItem) => {
    const confirmMessage = item.isSold
      ? `¿Volver a publicar "${item.title}"? Va a mostrarse otra vez como disponible y a aceptar consultas.`
      : `¿Marcar "${item.title}" como vendido? Va a mostrarse en blanco y negro con la etiqueta "Vendido" y ya no va a aceptar consultas. Podés volver a publicarlo después si hace falta.`;
    if (!window.confirm(confirmMessage)) return;

    setTogglingId(item.id);
    try {
      const { id, ...input } = item;
      await update(id, { ...input, isSold: !item.isSold });
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="admin-crud-section">
      <div className="admin-crud-header">
        <h2 className="admin-crud-title">{label}</h2>
        {!isFormOpen && (
          <button className="admin-btn" onClick={openCreateForm}>Agregar unidad</button>
        )}
      </div>

      {error && <p className="admin-error">Error al cargar datos: {error}</p>}

      {isFormOpen && (
        <form className="admin-crud-form" onSubmit={handleSubmit}>
          <div>
            <label className="admin-label" htmlFor="crud-title">Marca, modelo y versión</label>
            <input
              id="crud-title"
              className="admin-input"
              placeholder="Ej: Toyota Corolla 2.0 XEI CVT"
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
          <div className="admin-crud-form-row">
            <div>
              <label className="admin-label" htmlFor="crud-year">Año</label>
              <input
                id="crud-year"
                type="number"
                min={1950}
                max={MAX_YEAR}
                className="admin-input"
                value={form.year}
                onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="admin-label" htmlFor="crud-km">Kilómetros</label>
              <input
                id="crud-km"
                type="number"
                min={0}
                step={100}
                className="admin-input"
                value={form.km}
                onChange={(e) => setForm((f) => ({ ...f, km: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="admin-label" htmlFor="crud-price">Precio (US$)</label>
              <input
                id="crud-price"
                type="number"
                min={0}
                step={100}
                className="admin-input"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                required
              />
            </div>
          </div>
          <div>
            <label className="admin-label" htmlFor="crud-date">Fecha de publicación</label>
            <input
              id="crud-date"
              type="date"
              className="admin-input"
              value={form.publishedAt}
              onChange={(e) => setForm((f) => ({ ...f, publishedAt: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="admin-label" htmlFor="crud-image">URL de imagen</label>
            <input
              id="crud-image"
              type="text"
              placeholder="/images/stock/usados/mi-unidad.jpg"
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
        <p className="admin-crud-empty">Todavía no hay unidades cargadas en {label}.</p>
      ) : (
        <ul className="admin-crud-list">
          {items.map((item) => (
            <li key={item.id} className="admin-crud-list-item">
              {item.imageUrl && <img src={item.imageUrl} alt="" className="admin-crud-thumb" />}
              <div className="admin-crud-item-info">
                <span className="admin-crud-item-title">
                  {item.title}
                  {item.isSold && <span className="admin-crud-badge">Vendido</span>}
                </span>
                <span className="admin-crud-item-date">
                  {item.year} · {formatKm(item.km)} · {formatPrice(item.price)} · Publicado el {formatDateEs(item.publishedAt)}
                </span>
              </div>
              <div className="admin-crud-item-actions">
                <button
                  className="admin-btn admin-btn-secondary"
                  onClick={() => handleToggleSold(item)}
                  disabled={isFormOpen || togglingId === item.id}
                >
                  {togglingId === item.id ? 'Guardando...' : item.isSold ? 'Volver a publicar' : 'Marcar vendido'}
                </button>
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
