import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Client-rendered SPA: there is no SSR, so per-route <title>/meta are managed
// by mutating <head> in an effect. The static defaults in index.html cover the
// first paint and JS-less crawlers (homepage values); this component upserts
// the same tags in place — it never duplicates them — as the route changes.

const SITE_NAME = 'Tu Marca';
const SITE_URL = 'https://tu-dominio.com';
const DEFAULT_TITLE = 'Plantilla de landing page';
const DEFAULT_DESCRIPTION = 'Descripción de ejemplo de tu marca o proyecto.';
const DESCRIPTION_MAX = 160;

interface SeoProps {
  /** Page name, prepended to the site name ("Cursos" → "Cursos · Tu Marca").
   *  Omit on the home page to use the full default title. */
  title?: string;
  /** Summary for the meta description and social cards; clamped to ~160 chars. */
  description?: string;
  /** og:type — "article" for news articles, "website" everywhere else. */
  type?: 'website' | 'article';
  /** Keep the page out of search results (admin screens). */
  noindex?: boolean;
}

function clamp(text: string, max = DESCRIPTION_MAX): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export const Seo: React.FC<SeoProps> = ({
  title,
  description,
  type = 'website',
  noindex = false,
}) => {
  const { pathname } = useLocation();

  const fullTitle = title ? `${title} · ${SITE_NAME}` : DEFAULT_TITLE;
  const desc = clamp(description?.trim() ? description : DEFAULT_DESCRIPTION);
  const url = `${SITE_URL}${pathname === '/' ? '/' : pathname}`;

  useEffect(() => {
    document.title = fullTitle;
    upsertMeta('name', 'description', desc);
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    upsertCanonical(url);

    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', desc);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:locale', 'es_AR');

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', desc);
  }, [fullTitle, desc, url, type, noindex]);

  return null;
};
