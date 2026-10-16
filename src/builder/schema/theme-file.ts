import { ThemeSchema } from "@/builder/theme/schema";
import type { Theme } from "@/builder/theme/schema";

/**
 * Theme file schema (M2). `theme.json` holds the tokens directly — no wrapper
 * envelope — so the file content validates 1:1 against `ThemeSchema` (M1).
 */
export { ThemeSchema };
export type { Theme };

export function parseThemeFile(data: unknown): Theme {
  return ThemeSchema.parse(data);
}
