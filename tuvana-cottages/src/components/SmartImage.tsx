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
  tone = 0,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Varies the placeholder shade so stacked panels never look identical. */
  tone?: number;
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
        className={`wood-placeholder ${["", "wood-1", "wood-2", "wood-3", "wood-4"][tone % 5]} flex items-center justify-center ${className}`}
        role="img"
        aria-label={alt}
      >
        {/* A calm mountain-and-cabin scene rather than a broken-image
            glyph, so a site awaiting its photos still looks composed. */}
        <svg
          viewBox="0 0 400 300"
          preserveAspectRatio="xMidYMax slice"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <circle cx="318" cy="72" r="15" fill="#e6c48f" opacity="0.28" />
          <path d="M0 190 60 140 110 175 170 118 240 180 300 143 360 186 400 158V300H0Z" fill="#1a0f08" opacity="0.22" />
          <path d="M0 221 70 179 130 216 200 168 270 216 340 184 400 216V300H0Z" fill="#1a0f08" opacity="0.34" />
          <path d="M0 256 80 224 150 251 230 214 320 251 400 229V300H0Z" fill="#1a0f08" opacity="0.5" />
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
