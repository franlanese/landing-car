import { useEffect, useMemo, useState } from 'react';
import type React from 'react';

// Sliding-window carousel that loops seamlessly: renders a few cloned
// slides before/after the real list so "next" past the last item keeps
// sliding forward into the clone of the first item (and vice versa for
// "prev"), then silently snaps the position back into the real range
// once the clone looks identical to the real slide — no visible rewind.
export function useInfiniteCarousel(itemsLength: number, cardsPerView: number) {
  // Number of distinct circular positions (and dots): one per item. In a
  // wrapping carousel every item can be the "lead" card of a window, no
  // matter how many cards are visible at once — using itemsLength here
  // (instead of itemsLength - cardsPerView + 1) keeps the snap-back shift
  // landing exactly on a real dot instead of an in-between window, which
  // is what caused the dots to drift out of sync after looping.
  const total = itemsLength;

  const [pos, setPos] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  // Keep pos within range whenever the viewport (cardsPerView) or list changes.
  // Adjusted during render (React's recommended pattern) instead of in an
  // effect, so it takes effect before paint with no extra render cycle.
  const [prevTotal, setPrevTotal] = useState(total);
  if (prevTotal !== total) {
    setPrevTotal(total);
    setPos((p) => ((p % total) + total) % total);
    setIsAnimating(false);
  }

  // Re-enable the transition on the frame right after an instant snap.
  useEffect(() => {
    if (!transitionEnabled) {
      const id = requestAnimationFrame(() => setTransitionEnabled(true));
      return () => cancelAnimationFrame(id);
    }
  }, [transitionEnabled, pos]);

  // Cloned render order: [..last `cardsPerView` items, ...all items, first `cardsPerView` items..]
  const renderIndices = useMemo(() => {
    const arr: number[] = [];
    for (let i = -cardsPerView; i < itemsLength + cardsPerView; i++) {
      arr.push(((i % itemsLength) + itemsLength) % itemsLength);
    }
    return arr;
  }, [itemsLength, cardsPerView]);

  const next = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setPos((p) => p + 1);
  };

  const prev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setPos((p) => p - 1);
  };

  const goToReal = (index: number) => {
    if (isAnimating) return;
    setPos(index);
  };

  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || e.propertyName !== 'transform') return;
    setIsAnimating(false);
    if (pos > total - 1) {
      setTransitionEnabled(false);
      setPos(pos - itemsLength);
    } else if (pos < 0) {
      setTransitionEnabled(false);
      setPos(pos + itemsLength);
    }
  };

  return {
    extIndex: pos + cardsPerView,
    renderIndices,
    percentPerSlide: 100 / cardsPerView,
    transitionEnabled,
    total,
    activeDot: ((pos % total) + total) % total,
    next,
    prev,
    goToReal,
    handleTransitionEnd,
  };
}
