import { z } from "zod";

/**
 * Builder theme tokens (M1). Source of truth for every color, radius, font,
 * spacing, and shadow value the visual builder may use. Validated on every
 * read and write; persisted as `src/content/theme.json` (M2 storage API).
 */

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, "expected #rrggbb hex");

const lightDark = z.object({
  light: hexColor,
  dark: hexColor,
});

export const COLOR_TOKENS = [
  "primary",
  "secondary",
  "accent",
  "background",
  "surface",
  "text",
  "muted",
  "border",
  "success",
  "warning",
  "danger",
] as const;

export type ColorToken = (typeof COLOR_TOKENS)[number];

export const RADIUS_KEYS = ["none", "sm", "md", "lg", "full"] as const;

export type RadiusKey = (typeof RADIUS_KEYS)[number];

export const SPACING_DENSITIES = ["compact", "comfortable", "spacious"] as const;

export type SpacingDensity = (typeof SPACING_DENSITIES)[number];

export const THEME_MODES = ["light", "dark"] as const;

export type ThemeMode = (typeof THEME_MODES)[number];

export const ThemeSchema = z.object({
  schemaVersion: z.literal(1),
  colors: z.object({
    primary: lightDark,
    secondary: lightDark,
    accent: lightDark,
    background: lightDark,
    surface: lightDark,
    text: lightDark,
    muted: lightDark,
    border: lightDark,
    success: lightDark,
    warning: lightDark,
    danger: lightDark,
  }),
  radius: z.object({
    none: z.string(),
    sm: z.string(),
    md: z.string(),
    lg: z.string(),
    full: z.string(),
    default: z.enum(RADIUS_KEYS),
  }),
  typography: z.object({
    heading: z.string(),
    body: z.string(),
    mono: z.string(),
    baseSizePx: z.number().min(12).max(20),
    scaleRatio: z.number().min(1.1).max(1.6),
    weights: z.object({
      regular: z.number(),
      medium: z.number(),
      bold: z.number(),
    }),
    lineHeights: z.object({
      tight: z.number(),
      normal: z.number(),
      relaxed: z.number(),
    }),
  }),
  spacing: z.object({
    density: z.enum(SPACING_DENSITIES),
    basePx: z.number().min(2).max(8),
  }),
  shadows: z.object({
    sm: z.string(),
    md: z.string(),
    lg: z.string(),
  }),
});

export type Theme = z.infer<typeof ThemeSchema>;
