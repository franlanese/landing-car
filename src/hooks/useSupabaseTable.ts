import { useCallback, useState } from 'react';
import { INITIAL_CONTENT } from '../data/content';
import type { ContentItem, TableName } from '../types/content';

export type ContentItemInput = Omit<ContentItem, 'id'>;

const byPublishedAt = (a: ContentItem, b: ContentItem) => a.publishedAt.localeCompare(b.publishedAt);

// In-memory replacement for the old Supabase-backed hook. Each call owns its
// own array (seeded from src/data/content.ts), so create/update/remove only
// mutate that instance's state for the lifetime of the session — nothing is
// persisted, and other mounted instances of this hook (e.g. Home vs the
// admin dashboard) don't see each other's edits. That's fine here: the goal
// is a functional-feeling admin demo, not real shared state.
export function useSupabaseTable(table: TableName) {
  const [items, setItems] = useState<ContentItem[]>(() => [...INITIAL_CONTENT[table]].sort(byPublishedAt));
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    // No-op: there's no backend to re-fetch from.
  }, []);

  const create = useCallback(async (input: ContentItemInput) => {
    const newItem: ContentItem = { id: crypto.randomUUID(), ...input };
    setItems((prev) => [...prev, newItem].sort(byPublishedAt));
  }, []);

  const update = useCallback(async (id: string, input: ContentItemInput) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...input } : item)).sort(byPublishedAt));
  }, []);

  const remove = useCallback(async (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return { items, loading, error, refetch, create, update, remove };
}
