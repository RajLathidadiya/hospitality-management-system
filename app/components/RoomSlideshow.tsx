'use client';

import { useEffect, useMemo, useState } from 'react';

type RoomSlideshowProps = {
  images?: string[];
  fallback?: string;
  alt: string;
};

export default function RoomSlideshow({
  images = [],
  fallback = '',
  alt,
}: RoomSlideshowProps) {
  const slides = useMemo(() => {
    const unique = Array.from(new Set((images || []).filter(Boolean)));
    return unique.length ? unique : fallback ? [fallback] : [];
  }, [images, fallback]);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [slides.join('|')]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) {
    return <div className="detail-room-image room-image-empty" aria-label={alt} />;
  }

  return (
    <div className="room-slideshow" aria-label={alt}>
      {slides.map((src, i) => (
        <img
          key={`${src}-${i}`}
          src={src}
          alt={`${alt} photo ${i + 1}`}
          className={`room-slide ${i === index ? 'is-active' : ''}`}
        />
      ))}

      {slides.length > 1 ? (
        <>
          <button
            type="button"
            className="room-slide-arrow room-slide-prev"
            onClick={() => setIndex((index - 1 + slides.length) % slides.length)}
            aria-label="Previous room photo"
          >
            ‹
          </button>
          <button
            type="button"
            className="room-slide-arrow room-slide-next"
            onClick={() => setIndex((index + 1) % slides.length)}
            aria-label="Next room photo"
          >
            ›
          </button>
          <div className="room-slide-dots" aria-hidden="true">
            {slides.map((_, i) => (
              <span key={i} className={i === index ? 'active' : ''} />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
