import { useMemo } from 'react';
import { INITIAL_CONTENT } from '../data/content';
import type { ContentItem, TableName } from '../types/content';

// Looks up a single item by id in the static example data. No loading/error
// states are meaningful without a real fetch, but they're kept in the return
// shape so callers (ContentDetail) don't need to change.
export function useSupabaseItem(table: TableName, id: string | undefined) {
  const item: ContentItem | null = useMemo(() => {
    if (!id) return null;
    return INITIAL_CONTENT[table].find((entry) => entry.id === id) ?? null;
  }, [table, id]);

  return { item, loading: false, error: null };
}
