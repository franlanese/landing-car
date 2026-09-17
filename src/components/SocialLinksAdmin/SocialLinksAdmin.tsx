import React, { useEffect, useState } from 'react';
import { useSocialLinks } from '../../hooks/useSocialLinks';
import { SOCIAL_PLATFORMS } from '../../types/social';
import '../../pages/admin/admin-shared.css';
import './SocialLinksAdmin.css';

export const SocialLinksAdmin: React.FC = () => {
  const { links, loading, error, save } = useSocialLinks();
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [initialized, setInitialized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (loading || initialized) return;
    const values: Record<string, string> = {};
    SOCIAL_PLATFORMS.forEach((platform) => {
      values[platform.key] = links.find((link) => link.platform === platform.key)?.url ?? '';
    });
    setFormValues(values);
    setInitialized(true);
  }, [loading, initialized, links]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaved(false);
    try {
      await save(formValues);
      setSaved(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Ocurrió un error al guardar.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="admin-crud-empty">Cargando...</p>;
  }

  return (
    <div className="social-links-admin">
      <h2 className="admin-crud-title">Redes Sociales</h2>
      <p className="social-links-admin-hint">
        Completá el link de cada red social que quieras mostrar. Las que dejes vacías no van a aparecer en el sitio.
      </p>

      {error && <p className="admin-error">Error al cargar: {error}</p>}

      <form className="social-links-form" onSubmit={handleSubmit}>
        {SOCIAL_PLATFORMS.map((platform) => (
          <div className="social-links-row" key={platform.key}>
            <img src={platform.icon} alt="" className="social-links-icon" />
            <label className="admin-label social-links-label" htmlFor={`social-${platform.key}`}>
              {platform.label}
            </label>
            <input
              id={`social-${platform.key}`}
              className="admin-input"
              type="url"
              placeholder="https://..."
              value={formValues[platform.key] ?? ''}
              onChange={(e) => setFormValues((prev) => ({ ...prev, [platform.key]: e.target.value }))}
            />
          </div>
        ))}

        {saveError && <p className="admin-error">{saveError}</p>}
        {saved && !saving && <p className="social-links-saved">Guardado.</p>}

        <button type="submit" className="admin-btn" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </form>
    </div>
  );
};
