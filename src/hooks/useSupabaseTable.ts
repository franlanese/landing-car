import { useCallback, useState } from 'react';
import { INITIAL_CONTENT } from '../data/content';
import type { ContentItem, TableName } from '../types/content';

export interface ContentItemInput {
  title: string;
  description: string;
  eventDate: string;
  imageUrl: string | null;
  isFinished: boolean;
}

function formatDateEs(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

// In-memory replacement for the old Supabase-backed hook. Each call owns its
// own array (seeded from src/data/content.ts), so create/update/remove only
// mutate that instance's state for the lifetime of the session — nothing is
// persisted, and other mounted instances of this hook (e.g. Home vs the
// admin dashboard) don't see each other's edits. That's fine here: the goal
// is a functional-feeling admin demo, not real shared state.
export function useSupabaseTable(table: TableName) {
  const [items, setItems] = useState<ContentItem[]>(() =>
    [...INITIAL_CONTENT[table]].sort((a, b) => a.eventDate.localeCompare(b.eventDate)),
  );
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    // No-op: there's no backend to re-fetch from.
  }, []);

  const create = useCallback(async (input: ContentItemInput) => {
    const newItem: ContentItem = {
      id: crypto.randomUUID(),
      title: input.title,
      description: input.description,
      dateTime: formatDateEs(input.eventDate),
      eventDate: input.eventDate,
      imageUrl: input.imageUrl,
      isFinished: input.isFinished,
    };
    setItems((prev) => [...prev, newItem].sort((a, b) => a.eventDate.localeCompare(b.eventDate)));
  }, []);

  const update = useCallback(async (id: string, input: ContentItemInput) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? {
                ...item,
                title: input.title,
                description: input.description,
                dateTime: formatDateEs(input.eventDate),
                eventDate: input.eventDate,
                imageUrl: input.imageUrl,
                isFinished: input.isFinished,
              }
            : item,
        )
        .sort((a, b) => a.eventDate.localeCompare(b.eventDate)),
    );
  }, []);

  const remove = useCallback(async (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return { items, loading, error, refetch, create, update, remove };
}
