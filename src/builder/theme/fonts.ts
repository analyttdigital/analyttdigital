import { IBM_Plex_Mono, Inter, Space_Grotesk } from "next/font/google";

/**
 * Curated builder font list (M1). Loaded once at build time via `next/font`
 * (works in Pages Router); the theme stores a font *name*, and `fontStack`
 * resolves it to the loaded CSS variable. New families must be added here
 * before they can be selected — custom upload is a later milestone.
 */

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-bld-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-bld-space-grotesk",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-bld-ibm-plex-mono",
  display: "swap",
});

export interface CuratedFont {
  name: string;
  variable: string;
  stack: string;
}

export const CURATED_FONTS: CuratedFont[] = [
  {
    name: "Inter",
    variable: inter.variable,
    stack: `var(${inter.variable}), ui-sans-serif, system-ui, sans-serif`,
  },
  {
    name: "Space Grotesk",
    variable: spaceGrotesk.variable,
    stack: `var(${spaceGrotesk.variable}), ui-sans-serif, system-ui, sans-serif`,
  },
  {
    name: "IBM Plex Mono",
    variable: ibmPlexMono.variable,
    stack: `var(${ibmPlexMono.variable}), ui-monospace, monospace`,
  },
];

/** Mount once wherever the builder tree renders (editor shell, renderer). */
export const builderFontsClass =
  `${inter.variable} ${spaceGrotesk.variable} ${ibmPlexMono.variable}`;

/** Resolve a theme font name to a `font-family` stack; unknown names fall back to Inter. */
export function fontStack(name: string): string {
  return CURATED_FONTS.find((f) => f.name === name)?.stack ?? CURATED_FONTS[0].stack;
}
