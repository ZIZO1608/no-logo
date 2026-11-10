type MarkProps = { className?: string };

/** The Ø mark on its own, drawn in the current text colour. */
export function LogoMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="27" fill="none" stroke="currentColor" strokeWidth="15" />
      <line x1="15.4" y1="84.6" x2="84.6" y2="15.4" stroke="currentColor" strokeWidth="13" />
    </svg>
  );
}

/** The full badge: off-white disc, black mark, as on the brand's profile. */
export function LogoBadge({ className }: MarkProps) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-paper text-ink ${className ?? ""}`}
    >
      <LogoMark className="h-[62%] w-[62%]" />
    </span>
  );
}
