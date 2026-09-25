import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { GlobalHeader } from '../../components/GlobalHeader/GlobalHeader';
import { Footer } from '../../components/Footer/Footer';
import { Seo } from '../../components/Seo/Seo';
import { InquiryForm } from '../../components/InquiryForm/InquiryForm';
import { VehicleCarousel } from '../../components/VehicleCarousel/VehicleCarousel';
import { useSupabaseItem } from '../../hooks/useSupabaseItem';
import { useSupabaseTable } from '../../hooks/useSupabaseTable';
import { formatDateEs, formatKm, formatPrice } from '../../lib/contentMapping';
import { TABLE_ITEM_LABELS, TABLE_LABELS, type TableName } from '../../types/content';
import '../Home.css';
import './ContentDetail.css';

const RELATED_COUNT = 6;

const BACK_LINKS: Record<TableName, { to: string; label: string }> = {
  usados: { to: '/#usados', label: 'Volver a Usados destacados' },
  motos: { to: '/#motos', label: 'Volver a Motos' },
  utilitarios: { to: '/#utilitarios', label: 'Volver a Utilitarios' },
};

interface ContentDetailProps {
  table: TableName;
}

export const ContentDetail: React.FC<ContentDetailProps> = ({ table }) => {
  const { id } = useParams<{ id: string }>();
  const { item, loading, error } = useSupabaseItem(table, id);
  const { items: sameCategory } = useSupabaseTable(table);

  const backLink = BACK_LINKS[table];

  // Other available units of the same category, newest first — excluding the
  // one being viewed and anything already sold.
  const related = sameCategory
    .filter((unit) => unit.id !== id && !unit.isSold)
    .slice(-RELATED_COUNT)
    .reverse();

  return (
    <div className="content-detail-page">
      {/* Fallbacks cover <title>/meta while the unit is loading or missing, so
          the tab and social previews never fall back to a bare "· Tu Concesionaria". */}
      <Seo
        title={item?.title ?? TABLE_ITEM_LABELS[table]}
        description={item?.description ?? `Detalle de una unidad de ${TABLE_LABELS[table].toLowerCase()}.`}
      />
      <div className="ambient-bg ambient-bg--fixed"></div>
      <div className="content-detail-stack">
      <GlobalHeader />

      <main className="content-detail-main">
        {loading ? (
          <p className="content-detail-status">Cargando...</p>
        ) : error || !item ? (
          <div className="content-detail-status">
            <p>{error ? `Error al cargar la unidad: ${error}` : 'No encontramos esta unidad. Puede que ya se haya vendido.'}</p>
            <Link to="/stock" className="content-detail-back">Ver todo el stock</Link>
          </div>
        ) : (
          <>
          <article className="content-detail-article">
            <Link to={backLink.to} className="content-detail-back">← {backLink.label}</Link>

            {item.imageUrl && (
              <div className="content-detail-image-wrapper">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className={`content-detail-image ${item.isSold ? 'is-sold' : ''}`}
                />
                {item.isSold && <span className="content-detail-sold-badge">Vendido</span>}
              </div>
            )}

            <span className="content-detail-eyebrow">
              {TABLE_LABELS[table]} · Publicado el {formatDateEs(item.publishedAt)}
            </span>
            <h1 className="content-detail-title">{item.title}</h1>

            <dl className="content-detail-specs">
              <div className="content-detail-spec">
                <dt>Año</dt>
                <dd>{item.year}</dd>
              </div>
              <div className="content-detail-spec">
                <dt>Kilómetros</dt>
                <dd>{formatKm(item.km)}</dd>
              </div>
              <div className={`content-detail-spec content-detail-spec--price ${item.isSold ? 'is-sold' : ''}`}>
                <dt>Precio</dt>
                <dd>{formatPrice(item.price)}</dd>
              </div>
            </dl>

            <p className="content-detail-description">{item.description}</p>

            <div className="content-detail-form-wrapper">
              {item.isSold ? (
                <p className="content-detail-finished-notice">
                  Esta unidad ya fue vendida. Mirá otras opciones parecidas acá abajo, o escribinos y te avisamos cuando ingrese una similar.
                </p>
              ) : (
                // Keyed by unit so moving between units (via the related
                // carousel) resets the form instead of keeping the last
                // unit's "¡Gracias!" message.
                <InquiryForm key={item.id} table={table} itemId={item.id} itemTitle={item.title} />
              )}
            </div>
          </article>

          {related.length > 0 && (
            <section className="content-detail-related">
              <h2 className="section-title">Otras unidades que te pueden interesar</h2>
              <VehicleCarousel items={related} linkTo={(unit) => `/${table}/${unit.id}`} />
              <div className="section-view-all">
                <Link to={`/stock?tipo=${table}`} className="cta-button">Ver todo el stock</Link>
              </div>
            </section>
          )}
          </>
        )}
      </main>

      <Footer />
      </div>
    </div>
  );
};
