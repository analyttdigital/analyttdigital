import type { Theme } from "./schema";

/**
 * Default builder theme (M1). Neutral light/dark pairs; the theme editor
 * (M3) overwrites these per site. Must always satisfy `ThemeSchema`.
 */
export const defaultTheme: Theme = {
  schemaVersion: 1,
  colors: {
    primary: { light: "#4f46e5", dark: "#818cf8" },
    secondary: { light: "#0f172a", dark: "#e2e8f0" },
    accent: { light: "#f04f26", dark: "#fb713b" },
    background: { light: "#ffffff", dark: "#0b0d12" },
    surface: { light: "#f4f5f7", dark: "#161a23" },
    text: { light: "#111418", dark: "#f2f4f8" },
    muted: { light: "#5b6472", dark: "#9aa3b2" },
    border: { light: "#e2e6ec", dark: "#2a3140" },
    success: { light: "#15803d", dark: "#4ade80" },
    warning: { light: "#b45309", dark: "#fbbf24" },
    danger: { light: "#b91c1c", dark: "#f87171" },
  },
  radius: {
    none: "0px",
    sm: "4px",
    md: "8px",
    lg: "16px",
    full: "9999px",
    default: "md",
  },
  typography: {
    heading: "Space Grotesk",
    body: "Inter",
    mono: "IBM Plex Mono",
    baseSizePx: 16,
    scaleRatio: 1.25,
    weights: { regular: 400, medium: 500, bold: 700 },
    lineHeights: { tight: 1.2, normal: 1.5, relaxed: 1.75 },
  },
  spacing: {
    density: "comfortable",
    basePx: 4,
  },
  shadows: {
    sm: "0 1px 2px rgb(0 0 0 / 0.06)",
    md: "0 4px 12px rgb(0 0 0 / 0.08)",
    lg: "0 12px 32px rgb(0 0 0 / 0.12)",
  },
};
