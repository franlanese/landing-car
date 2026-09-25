import React, { useState } from 'react';

// Pixels at or below this alpha, or with every channel at or above WHITE_MIN,
// count as empty margin.
const ALPHA_MIN = 16;
const WHITE_MIN = 245;
// Logos are scanned (and re-encoded) at most this big: plenty for a tile
// that's ~300px wide, even on 2x screens, and keeps huge PNGs fast.
const MAX_SIZE = 800;
// Don't bother re-encoding when the margins are negligible.
const MIN_MARGIN_RATIO = 0.08;

// One result per source URL: the brands carousel renders cloned pages, so the
// same logo mounts several times.
const cache = new Map<string, string | null>();

/** Crops an image to its visible content (drops transparent or white
 *  margins). Returns a data URL, or null when there's nothing worth trimming
 *  or the pixels can't be read (e.g. a cross-origin URL set from the admin). */
function trimMargins(img: HTMLImageElement): string | null {
  const scale = Math.min(1, MAX_SIZE / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(1, Math.round(img.naturalWidth * scale));
  const h = Math.max(1, Math.round(img.naturalHeight * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0, w, h);

  let data: Uint8ClampedArray;
  try {
    data = ctx.getImageData(0, 0, w, h).data;
  } catch {
    return null;
  }

  let minX = w, minY = h, maxX = -1, maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const empty = data[i + 3] <= ALPHA_MIN || (data[i] >= WHITE_MIN && data[i + 1] >= WHITE_MIN && data[i + 2] >= WHITE_MIN);
      if (!empty) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return null;

  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;
  if (1 - (cropW * cropH) / (w * h) < MIN_MARGIN_RATIO) return null;

  const out = document.createElement('canvas');
  out.width = cropW;
  out.height = cropH;
  out.getContext('2d')?.drawImage(canvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);
  return out.toDataURL('image/png');
}

interface BrandLogoProps {
  src: string;
  alt: string;
  className?: string;
}

/** Brand logo that ignores the empty margins baked into the image file, so
 *  every logo fills its tile the same way regardless of how it was exported. */
export const BrandLogo: React.FC<BrandLogoProps> = ({ src, alt, className }) => {
  const [trimmed, setTrimmed] = useState<{ src: string; url: string | null } | null>(() =>
    cache.has(src) ? { src, url: cache.get(src) ?? null } : null,
  );
  const trimmedUrl = trimmed?.src === src ? trimmed.url : null;

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (trimmed?.src === src) return;
    const url = cache.has(src) ? cache.get(src) ?? null : trimMargins(e.currentTarget);
    cache.set(src, url);
    setTrimmed({ src, url });
  };

  return <img src={trimmedUrl ?? src} alt={alt} className={className} onLoad={handleLoad} />;
};
