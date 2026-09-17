import { useCallback, useState } from 'react';
import { INITIAL_SOCIAL_LINKS } from '../data/socialLinks';
import { SOCIAL_PLATFORMS, type SocialLinkRow, type SocialPlatform } from '../types/social';

// In-memory replacement for the old Supabase-backed hook — see
// useSupabaseTable.ts for why this doesn't persist or sync across instances.
export function useSocialLinks() {
  const [links, setLinks] = useState<SocialLinkRow[]>(() => [...INITIAL_SOCIAL_LINKS]);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    // No-op: there's no backend to re-fetch from.
  }, []);

  const save = useCallback(async (urls: Record<string, string>) => {
    const rows = SOCIAL_PLATFORMS.map((platform) => ({
      platform: platform.key,
      url: urls[platform.key]?.trim() ? urls[platform.key].trim() : null,
    }));
    setLinks(rows);
  }, []);

  return { links, loading, error, refetch, save };
}

export interface VisibleSocialLink extends SocialPlatform {
  url: string;
}

export function getVisibleSocialLinks(links: SocialLinkRow[]): VisibleSocialLink[] {
  return SOCIAL_PLATFORMS.flatMap((platform) => {
    const row = links.find((link) => link.platform === platform.key);
    if (!row || !row.url) return [];
    return [{ ...platform, url: row.url }];
  });
}
