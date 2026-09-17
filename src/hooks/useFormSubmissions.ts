import { useCallback, useState } from 'react';
import { INITIAL_FORM_SUBMISSIONS } from '../data/formSubmissions';
import type { FormSubmission } from '../types/formSubmission';

// In-memory replacement for the old Supabase-backed hook: returns the static
// example submissions directly, sorted newest first like the original merge did.
export function useFormSubmissions() {
  const [submissions] = useState<FormSubmission[]>(() =>
    [...INITIAL_FORM_SUBMISSIONS].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  );
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    // No-op: there's no backend to re-fetch from.
  }, []);

  return { submissions, loading, error, refetch };
}
