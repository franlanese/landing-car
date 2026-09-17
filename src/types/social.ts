export interface SocialPlatform {
  key: string;
  label: string;
  icon: string;
}

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  { key: 'instagram', label: 'Instagram', icon: '/images/Iconos50x50/icons8-instagram-50.svg' },
  { key: 'linkedin', label: 'LinkedIn', icon: '/images/Iconos50x50/icons8-linkedin-50.svg' },
  { key: 'twitter', label: 'Twitter / X', icon: '/images/Iconos50x50/icons8-twitterx-50.svg' },
  { key: 'facebook', label: 'Facebook', icon: '/images/Iconos50x50/icons8-facebook-50.svg' },
  { key: 'tiktok', label: 'TikTok', icon: '/images/Iconos50x50/icons8-tiktok-50.svg' },
  { key: 'youtube', label: 'YouTube', icon: '/images/Iconos50x50/icons8-youtube-play-50.svg' },
];

export interface SocialLinkRow {
  platform: string;
  url: string | null;
}
