import type { SocialLinkRow } from '../types/social';

// Static example social links for the template — one row per platform
// defined in SOCIAL_PLATFORMS (src/types/social.ts). Pointing them at '#'
// keeps the icons visible in GlobalHeader/AlmaFooter as a working example;
// swap in real URLs (or null to hide a platform) for a real client.
export const INITIAL_SOCIAL_LINKS: SocialLinkRow[] = [
  { platform: 'instagram', url: '#' },
  { platform: 'linkedin', url: '#' },
  { platform: 'twitter', url: '#' },
  { platform: 'facebook', url: '#' },
  { platform: 'tiktok', url: '#' },
  { platform: 'youtube', url: '#' },
];
