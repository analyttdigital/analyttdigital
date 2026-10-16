/**
 * Curated builder font list (M1). Self-hosted through Fontsource rather than
 * `next/font/google`: the Google path needs build-time access to Google
 * Fonts, which sandboxed and offline builds cannot guarantee (M3 build
 * failure). Fontsource CSS is global, so the weight files are imported once
 * in `_app.tsx`; this module only maps theme font names to family stacks.
 */

export interface CuratedFont {
  name: string;
  stack: string;
}

export const CURATED_FONTS: CuratedFont[] = [
  {
    name: "Inter",
    stack: `"Inter", ui-sans-serif, system-ui, sans-serif`,
  },
  {
    name: "Space Grotesk",
    stack: `"Space Grotesk", ui-sans-serif, system-ui, sans-serif`,
  },
  {
    name: "IBM Plex Mono",
    stack: `"IBM Plex Mono", ui-monospace, SFMono-Regular, monospace`,
  },
];

/**
 * Kept for call-site stability: Fontsource needs no variable classes, so
 * there is nothing to mount. The renderer keeps spreading this on its
 * wrapper so a future variable-font switch stays a one-line change.
 */
export const builderFontsClass = "";

/** Resolve a theme font name to a `font-family` stack; unknown names fall back to Inter. */
export function fontStack(name: string): string {
  return CURATED_FONTS.find((f) => f.name === name)?.stack ?? CURATED_FONTS[0].stack;
}
