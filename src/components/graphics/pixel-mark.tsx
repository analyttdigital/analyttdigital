/**
 * PixelMark — the wordmark's glyph.
 *
 * Drawn rather than imported so it carries the world's own language: three
 * ascending square columns and a live ember packet on the tallest one. It is
 * a results chart at 20 pixels, which is the only honest thing for a
 * measurement agency to put next to its name.
 */
export function PixelMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 27 19" className={className} aria-hidden="true" fill="none">
      <rect x="0" y="12" width="7" height="7" fill="currentColor" />
      <rect x="10" y="7" width="7" height="12" fill="currentColor" />
      <rect x="20" y="0" width="7" height="19" fill="rgb(var(--color-accent-500))" />
    </svg>
  );
}