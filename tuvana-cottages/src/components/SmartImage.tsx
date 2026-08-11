"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Photo with a graceful fallback.
 *
 * The site ships before the real photos are uploaded, and a missing file
 * would otherwise leave a broken-image icon in the middle of the gallery.
 * Instead we fall back to the wood-grain panel, which reads as a design
 * choice rather than a bug.
 */
export function SmartImage({
  src,
  alt,
  className = "",
  sizes,
  priority = false,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // The markup is server-rendered, so a 404 can resolve before React
  // hydrates and the onError event is lost entirely — which would leave
  // the browser's broken-image icon and the alt text on the page. Re-check
  // on mount: a finished image with zero natural width has failed.
  useEffect(() => {
    const el = ref.current;
    if (el?.complete && el.naturalWidth === 0) setFailed(true);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        className={`wood-placeholder flex items-center justify-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <svg viewBox="0 0 48 40" className="h-10 w-10 text-cream/35" fill="none" aria-hidden="true">
          <path d="M6 24 24 8l18 16v12H6Z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
          <path d="M20 36v-8h8v8" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- photos are owner-uploaded
    // files of unknown dimensions; plain <img> keeps the fallback logic simple.
    <img
      ref={ref}
      src={src}
      alt={alt}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
