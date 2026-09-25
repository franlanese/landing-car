import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Jumps to the top of the page whenever the route (pathname) changes.
// - Layout effect + `behavior: 'instant'`: runs before the new page paints and
//   overrides the global `scroll-behavior: smooth`, so there's no visible
//   scroll animation from the previous page's position.
// - Only the pathname matters: changing /stock filters (?tipo=, ?orden=)
//   keeps the scroll position.
// - Links with a hash (/#contacto) are left alone; GlobalHeader scrolls to
//   that section instead.
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset on route change only, not on hash changes
  }, [pathname]);

  return null;
}
