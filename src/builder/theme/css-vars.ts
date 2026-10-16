import type { Theme, ThemeMode } from "./schema";
import { COLOR_TOKENS } from "./schema";
import { fontStack } from "./fonts";

/**
 * Convert a theme into CSS variables (M1). Applied inline on the
 * `ThemeProvider` wrapper so builder tokens stay scoped to the builder tree
 * and never clobber the site's own `:root` tokens. Changing any token (or the
 * mode) recomputes the vars, so the canvas restyles instantly with no reload.
 */

const DENSITY_SCALE = {
  compact: 0.75,
  comfortable: 1,
  spacious: 1.35,
} as const;

export function toCssVars(theme: Theme, mode: ThemeMode): Record<string, string> {
  const vars: Record<string, string> = {};

  for (const token of COLOR_TOKENS) {
    vars[`--bld-color-${token}`] = theme.colors[token][mode];
  }

  vars["--bld-radius-none"] = theme.radius.none;
  vars["--bld-radius-sm"] = theme.radius.sm;
  vars["--bld-radius-md"] = theme.radius.md;
  vars["--bld-radius-lg"] = theme.radius.lg;
  vars["--bld-radius-full"] = theme.radius.full;
  vars["--bld-radius-default"] = theme.radius[theme.radius.default];

  vars["--bld-font-heading"] = fontStack(theme.typography.heading);
  vars["--bld-font-body"] = fontStack(theme.typography.body);
  vars["--bld-font-mono"] = fontStack(theme.typography.mono);
  vars["--bld-font-size-base"] = `${theme.typography.baseSizePx}px`;
  vars["--bld-font-scale"] = String(theme.typography.scaleRatio);
  vars["--bld-font-weight-regular"] = String(theme.typography.weights.regular);
  vars["--bld-font-weight-medium"] = String(theme.typography.weights.medium);
  vars["--bld-font-weight-bold"] = String(theme.typography.weights.bold);
  vars["--bld-line-height-tight"] = String(theme.typography.lineHeights.tight);
  vars["--bld-line-height-normal"] = String(theme.typography.lineHeights.normal);
  vars["--bld-line-height-relaxed"] = String(theme.typography.lineHeights.relaxed);

  vars["--bld-spacing-base"] = `${theme.spacing.basePx}px`;
  vars["--bld-spacing-scale"] = String(DENSITY_SCALE[theme.spacing.density]);

  vars["--bld-shadow-sm"] = theme.shadows.sm;
  vars["--bld-shadow-md"] = theme.shadows.md;
  vars["--bld-shadow-lg"] = theme.shadows.lg;

  return vars;
}
