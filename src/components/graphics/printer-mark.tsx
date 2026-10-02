/**
 * PrinterMark — the sheet's registration mark.
 *
 * A press sheet carries crop and registration marks so the press can be
 * checked against the plate; the mark that says "these two things line up"
 * is exactly what attribution does. Drawn here rather than imported so it
 * carries the sheet's own stroke weight (1.5px hairline, square corners)
 * instead of a generic icon set.
 */
export function PrinterMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" fill="none">
      <circle cx="16" cy="16" r="8.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M16 1.5v6M16 24.5v6M1.5 16h6M24.5 16h6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <circle cx="16" cy="16" r="2" fill="rgb(var(--color-accent-500))" />
    </svg>
  );
}
