/** The cabin-roof mark and wordmark from the flyer, drawn as SVG. */
export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 40" fill="none" className={className} aria-hidden="true">
      {/* back cabin */}
      <path
        d="M4 22 14 12l10 10v14H4Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* front cabin, overlapping like the printed mark */}
      <path
        d="M20 26 32 14l12 12v10H20Z"
        fill="currentColor"
        fillOpacity="0.12"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M30 36v-6h4v6" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({
  className = "",
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  const color = tone === "light" ? "text-cream" : "text-bark";
  return (
    <div className={`flex items-center gap-2.5 ${color} ${className}`}>
      <LogoMark className="h-9 w-9 shrink-0 text-gold" />
      <div className="leading-none">
        <div className="text-lg font-extrabold tracking-tight">أكواخ توفانا</div>
        <div className="mt-0.5 text-[9px] font-medium tracking-[0.28em] opacity-70">
          TUVANA COTTAGES
        </div>
      </div>
    </div>
  );
}
