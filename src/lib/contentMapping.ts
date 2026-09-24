import type { ContentItem } from '../types/content';

export interface ContentRow {
  id: string;
  title: string;
  description: string;
  published_at: string;
  image_url: string | null;
  is_sold: boolean;
  year: number;
  km: number;
  price_usd: number;
}

export function formatDateEs(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

export function formatKm(km: number): string {
  return `${km.toLocaleString('es-AR')} km`;
}

export function formatPrice(priceUsd: number): string {
  return `US$ ${priceUsd.toLocaleString('es-AR')}`;
}

export function rowToItem(row: ContentRow): ContentItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    publishedAt: row.published_at,
    imageUrl: row.image_url,
    isSold: row.is_sold,
    year: row.year,
    km: row.km,
    price: row.price_usd,
  };
}
