export type TableName = 'usados' | 'motos' | 'utilitarios';

/** Every category, in the order they're shown (home sections, /stock filters, admin tabs). */
export const TABLE_NAMES: TableName[] = ['usados', 'motos', 'utilitarios'];

/** A vehicle listing. */
export interface ContentItem {
  id: string;
  /** Brand + model + version, e.g. "Toyota Corolla 2.0 XEI CVT". */
  title: string;
  description: string;
  /** Publication date, ISO `yyyy-mm-dd`. Lists are sorted by it (oldest first). */
  publishedAt: string;
  imageUrl: string | null;
  /** Already sold: shown grayscale with a "Vendido" badge and no inquiry form. */
  isSold: boolean;
  year: number;
  km: number;
  /** Price in US dollars. */
  price: number;
}

export const TABLE_LABELS: Record<TableName, string> = {
  usados: 'Usados destacados',
  motos: 'Motos',
  utilitarios: 'Utilitarios',
};

/** Singular, per-unit label (card eyebrow on the mixed /stock grid, SEO fallbacks). */
export const TABLE_ITEM_LABELS: Record<TableName, string> = {
  usados: 'Auto',
  motos: 'Moto',
  utilitarios: 'Utilitario',
};
