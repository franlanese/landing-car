import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { GlobalHeader } from '../../components/GlobalHeader/GlobalHeader';
import { AlmaFooter } from '../../components/AlmaFooter/AlmaFooter';
import { Footer } from '../../components/Footer/Footer';
import { Seo } from '../../components/Seo/Seo';
import { VehicleCard } from '../../components/VehicleCard/VehicleCard';
import { CategoryIcon } from '../../components/CategoryIcon/CategoryIcon';
import { useSupabaseTable } from '../../hooks/useSupabaseTable';
import { TABLE_ITEM_LABELS, TABLE_LABELS, TABLE_NAMES, type ContentItem, type TableName } from '../../types/content';
import '../Home.css';
import './Catalogo.css';

type SortKey = 'recientes' | 'precio-asc' | 'precio-desc' | 'km-asc';

const SORT_OPTIONS: { key: SortKey; label: string; compare: (a: ContentItem, b: ContentItem) => number }[] = [
  { key: 'recientes', label: 'Más recientes', compare: (a, b) => b.publishedAt.localeCompare(a.publishedAt) },
  { key: 'precio-asc', label: 'Menor precio', compare: (a, b) => a.price - b.price },
  { key: 'precio-desc', label: 'Mayor precio', compare: (a, b) => b.price - a.price },
  { key: 'km-asc', label: 'Menos kilómetros', compare: (a, b) => a.km - b.km },
];

function isTableName(value: string | null): value is TableName {
  return (TABLE_NAMES as (string | null)[]).includes(value);
}

// Full stock across every category, filterable by `?tipo=<table>` and
// sortable by `?orden=<SortKey>` (both kept in the URL so Home's per-category
// "Ver todos" buttons can deep-link into a filtered view). Sold units always
// go last, whatever the sort.
export const Catalogo: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tipoParam = searchParams.get('tipo');
  const activeTable = isTableName(tipoParam) ? tipoParam : null;
  const sort = SORT_OPTIONS.find((option) => option.key === searchParams.get('orden')) ?? SORT_OPTIONS[0];

  const usados = useSupabaseTable('usados');
  const motos = useSupabaseTable('motos');
  const utilitarios = useSupabaseTable('utilitarios');
  const tables: Record<TableName, ReturnType<typeof useSupabaseTable>> = { usados, motos, utilitarios };

  const loading = TABLE_NAMES.some((table) => tables[table].loading);
  const error = TABLE_NAMES.map((table) => tables[table].error).find(Boolean);

  const entries = TABLE_NAMES.flatMap((table) => tables[table].items.map((item) => ({ table, item })));
  const visible = entries
    .filter((entry) => !activeTable || entry.table === activeTable)
    .sort((a, b) => Number(a.item.isSold) - Number(b.item.isSold) || sort.compare(a.item, b.item));
  const availableCount = entries.filter((entry) => !entry.item.isSold).length;

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next, { replace: true });
  };

  const countFor = (table: TableName | null) =>
    table ? tables[table].items.length : entries.length;

  const filters: { key: TableName | null; label: string }[] = [
    { key: null, label: 'Todos' },
    ...TABLE_NAMES.map((table) => ({ key: table, label: TABLE_LABELS[table] })),
  ];

  return (
    <div className="catalogo-container">
      <Seo
        title={activeTable ? `Stock de ${TABLE_LABELS[activeTable].toLowerCase()}` : 'Stock completo'}
        description="Autos, motos y utilitarios usados revisados y listos para transferir. Financiación y permutas."
      />
      <div className="ambient-bg ambient-bg--fixed"></div>
      <div className="catalogo-stack">
      <GlobalHeader />

      <section className="catalogo-page">
        <div className="catalogo-header">
          <Link to="/" className="catalogo-back">&larr; Volver al inicio</Link>
          <h1 className="section-title">NUESTRO STOCK</h1>
          <p className="catalogo-summary">
            <strong>{availableCount} unidades disponibles</strong> · autos, motos y utilitarios revisados y listos para transferir.
          </p>
        </div>

        <div className="catalogo-toolbar">
          <div className="catalogo-filters" role="group" aria-label="Filtrar por categoría">
            {filters.map((filter) => (
              <button
                key={filter.key ?? 'todos'}
                type="button"
                className={`catalogo-chip ${activeTable === filter.key ? 'active' : ''}`}
                aria-pressed={activeTable === filter.key}
                onClick={() => setParam('tipo', filter.key)}
              >
                {filter.key && <CategoryIcon table={filter.key} size={18} />}
                {filter.label}
                <span className="catalogo-chip-count">{countFor(filter.key)}</span>
              </button>
            ))}
          </div>

          <label className="catalogo-sort">
            Ordenar por
            <select
              value={sort.key}
              onChange={(e) => setParam('orden', e.target.value === SORT_OPTIONS[0].key ? null : e.target.value)}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.key} value={option.key}>{option.label}</option>
              ))}
            </select>
          </label>
        </div>

        {loading || visible.length === 0 ? (
          <div className="content-loading">
            {loading ? 'Cargando...' : error ? `Error al cargar: ${error}` : 'No hay unidades en esta categoría por ahora.'}
          </div>
        ) : (
          <div className="catalogo-grid">
            {visible.map(({ table, item }) => (
              <VehicleCard
                key={`${table}-${item.id}`}
                item={item}
                to={`/${table}/${item.id}`}
                eyebrow={TABLE_ITEM_LABELS[table]}
              />
            ))}
          </div>
        )}
      </section>

      <AlmaFooter />
      <Footer />
      </div>
    </div>
  );
};
