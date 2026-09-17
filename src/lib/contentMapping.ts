import type { ContentItem } from '../types/content';

export interface ContentRow {
  id: string;
  title: string;
  description: string;
  event_date: string;
  image_url: string | null;
  is_finished: boolean;
}

export function formatDateEs(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

export function rowToItem(row: ContentRow): ContentItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    dateTime: formatDateEs(row.event_date),
    eventDate: row.event_date,
    imageUrl: row.image_url,
    isFinished: row.is_finished,
  };
}
