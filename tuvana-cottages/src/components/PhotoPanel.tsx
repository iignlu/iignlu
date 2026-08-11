import { SmartImage } from "./SmartImage";

/**
 * A photo that fills the screen, with at most one line of text on it.
 *
 * The whole site is built out of these: the images carry the message and
 * the interface stays out of the way. Panels stop short of full height so
 * the top of the next photo is always visible, which is what tells a
 * guest to keep scrolling — no arrows or hints needed.
 */
export function PhotoPanel({
  src,
  caption,
  alt,
  tone = 0,
  height = "h-[82svh]",
  priority = false,
  children,
}: {
  src?: string | null;
  caption?: string;
  alt: string;
  tone?: number;
  height?: string;
  priority?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section className={`relative isolate w-full overflow-hidden ${height}`}>
      <SmartImage
        src={src}
        alt={alt}
        tone={tone}
        priority={priority}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* pb-24 keeps captions clear of the fixed booking bar, which would
          otherwise sit right on top of them. */}
      {(caption || children) && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-espresso/80 via-espresso/25 to-transparent pt-24 pb-24">
          <div className="pointer-events-auto mx-auto max-w-5xl px-6">
            {children}
            {caption && (
              <p className="text-sm font-medium tracking-wide text-cream/90 sm:text-base">
                {caption}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
