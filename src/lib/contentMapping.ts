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

/** Units priced below this (in US$) are shown in pesos instead of dollars. */
export const PESOS_THRESHOLD_USD = 25000;

/** Pesos per dollar for that conversion (dólar oficial BNA, venta, 24/09/2026).
 *  Update it when the rate moves. */
export const ARS_PER_USD = 1540;

/** Prices are stored in US$ (so sorting is consistent across currencies);
 *  cheaper units are displayed in pesos, rounded to the nearest $10.000. */
export function formatPrice(priceUsd: number): string {
  if (priceUsd < PESOS_THRESHOLD_USD) {
    const priceArs = Math.round((priceUsd * ARS_PER_USD) / 10000) * 10000;
    return `$ ${priceArs.toLocaleString('es-AR')}`;
  }
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
