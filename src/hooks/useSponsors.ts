import { useCallback, useState } from 'react';
import { INITIAL_SPONSORS } from '../data/sponsors';
import type { Sponsor } from '../types/sponsor';

export interface SponsorInput {
  name: string;
  imageUrl: string | null;
  url: string | null;
}

// In-memory replacement for the old Supabase-backed hook — see
// useSupabaseTable.ts for why this doesn't persist or sync across instances.
export function useSponsors() {
  const [items, setItems] = useState<Sponsor[]>(() => [...INITIAL_SPONSORS]);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    // No-op: there's no backend to re-fetch from.
  }, []);

  const create = useCallback(async (input: SponsorInput) => {
    const newSponsor: Sponsor = { id: crypto.randomUUID(), name: input.name, imageUrl: input.imageUrl, url: input.url };
    setItems((prev) => [...prev, newSponsor]);
  }, []);

  const update = useCallback(async (id: string, input: SponsorInput) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, name: input.name, imageUrl: input.imageUrl, url: input.url } : item)),
    );
  }, []);

  const remove = useCallback(async (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return { items, loading, error, refetch, create, update, remove };
}
