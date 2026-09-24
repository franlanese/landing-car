import React from 'react';
import { Link } from 'react-router-dom';
import { formatKm, formatPrice } from '../../lib/contentMapping';
import type { ContentItem } from '../../types/content';
import './VehicleCard.css';

interface VehicleCardProps {
  item: ContentItem;
  /** Detail-page link. */
  to: string;
  /** Small label above the title, e.g. the category on the mixed /stock grid. */
  eyebrow?: string;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ item, to, eyebrow }) => (
  <article className={`vehicle-card ${item.isSold ? 'is-sold' : ''}`}>
    <div className="vehicle-card-image-wrapper">
      <img src={item.imageUrl ?? ''} alt={item.title} className="vehicle-card-image" draggable="false" />
      <div className="vehicle-card-image-overlay"></div>
      <span className="vehicle-card-badge">
        {item.year} · {formatKm(item.km)}
      </span>
      {item.isSold && <span className="vehicle-card-sold">Vendido</span>}
    </div>
    <div className="vehicle-card-content">
      {eyebrow && <span className="vehicle-card-eyebrow">{eyebrow}</span>}
      <h3 className="vehicle-card-title">{item.title}</h3>
      <p className="vehicle-card-description">{item.description}</p>
      <div className="vehicle-card-footer">
        <span className="vehicle-card-price">{formatPrice(item.price)}</span>
        <Link className="vehicle-card-btn" to={to}>
          {item.isSold ? 'Ver detalle' : 'Ver unidad'}
        </Link>
      </div>
    </div>
  </article>
);
