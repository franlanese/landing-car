import React, { useEffect, useState } from 'react';
import { useInfiniteCarousel } from '../../hooks/useInfiniteCarousel';
import type { ContentItem } from '../../types/content';
import { VehicleCard } from '../VehicleCard/VehicleCard';
import './VehicleCarousel.css';

const MOBILE_BREAKPOINT = 768;
const DRAG_THRESHOLD = 60;
const AUTOPLAY_MS = 5000;

interface VehicleCarouselProps {
  items: ContentItem[];
  /** Detail-page link for each card. */
  linkTo: (item: ContentItem) => string;
  /** Auto-advance every few seconds (paused on hover and while dragging). */
  autoplay?: boolean;
  /** Extra classes for the wrapper, e.g. Home's reveal-on-scroll classes. */
  className?: string;
}

// Infinite-loop carousel of VehicleCards: 1 card per view on mobile, 2 on
// desktop, with arrows, dots and pointer-drag. Expects a non-empty `items`
// array — callers render their own empty/loading state instead.
export const VehicleCarousel: React.FC<VehicleCarouselProps> = ({ items, linkTo, autoplay = false, className = '' }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE_BREAKPOINT);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  // Never show more cards per view than there are items, or the clone
  // padding would render the same card twice side by side.
  const cardsPerView = Math.min(isMobile ? 1 : 2, Math.max(items.length, 1));
  const carousel = useInfiniteCarousel(Math.max(items.length, 1), cardsPerView);
  const hasControls = items.length > cardsPerView;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!autoplay || !hasControls || isPaused) return;
    const interval = setInterval(() => {
      carousel.next();
    }, AUTOPLAY_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay, hasControls, isPaused]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!hasControls || e.button !== 0) return;
    if ((e.target as HTMLElement).closest('button, a')) return;
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragOffset(0);
    setIsPaused(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setDragOffset(e.clientX - dragStartX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);

    if (dragOffset < -DRAG_THRESHOLD) {
      carousel.next();
    } else if (dragOffset > DRAG_THRESHOLD) {
      carousel.prev();
    }

    setDragOffset(0);
    setIsPaused(false);
  };

  return (
    <div
      className={`slideshow-wrapper ${hasControls ? '' : 'slideshow-wrapper--static'} ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ touchAction: 'pan-y', cursor: !hasControls ? 'auto' : isDragging ? 'grabbing' : 'grab' }}
    >
      {hasControls && (
        <>
          <button className="slideshow-arrow prev" onClick={carousel.prev} aria-label="Anterior">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <button className="slideshow-arrow next" onClick={carousel.next} aria-label="Siguiente">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </>
      )}

      <div className="slideshow-track-outer">
        <div
          className="slideshow-track"
          onTransitionEnd={carousel.handleTransitionEnd}
          style={{
            transform: `translateX(calc(-${carousel.extIndex * carousel.percentPerSlide}% + ${dragOffset}px))`,
            transition: isDragging || !carousel.transitionEnabled ? 'none' : 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
            pointerEvents: isDragging ? 'none' : 'auto',
          }}
        >
          {carousel.renderIndices.map((itemIdx, i) => {
            const item = items[itemIdx];
            return (
              <div className="slideshow-slide" key={`${item.id}-${i}`} style={{ flexBasis: `${carousel.percentPerSlide}%` }}>
                <VehicleCard item={item} to={linkTo(item)} />
              </div>
            );
          })}
        </div>
      </div>

      {hasControls && (
        <div className="slideshow-dots">
          {Array.from({ length: carousel.total }).map((_, index) => (
            <button
              key={index}
              className={`slideshow-dot ${index === carousel.activeDot ? 'active' : ''}`}
              onClick={() => carousel.goToReal(index)}
              aria-label={`Ir a diapositiva ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
