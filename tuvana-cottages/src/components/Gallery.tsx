"use client";

import { useEffect, useState } from "react";
import { SmartImage } from "./SmartImage";

/** Photo grid with a tap-to-enlarge lightbox, closed with Escape or a tap. */
export function Gallery({ images }: { images: string[] }) {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i + 1) % images.length));
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i - 1 + images.length) % images.length));
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, images.length]);

  return (
    <>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3.5">
        {images.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={() => setOpen(i)}
            className={`group relative overflow-hidden rounded-xl2 ${
              i === 0 ? "col-span-2 row-span-2 aspect-4/3 sm:aspect-square" : "aspect-square"
            }`}
            aria-label={`عرض الصورة ${i + 1}`}
          >
            <SmartImage
              src={src}
              alt={`صورة من أكواخ توفانا رقم ${i + 1}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-espresso/95 p-4"
          onClick={() => setOpen(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setOpen(null)}
            aria-label="إغلاق"
            className="absolute top-5 left-5 flex h-11 w-11 items-center justify-center rounded-full bg-cream/15 text-2xl text-cream"
          >
            ×
          </button>
          <SmartImage
            src={images[open]}
            alt={`صورة من أكواخ توفانا رقم ${open + 1}`}
            className="max-h-[85vh] w-auto max-w-full rounded-xl2 object-contain"
          />
        </div>
      )}
    </>
  );
}
