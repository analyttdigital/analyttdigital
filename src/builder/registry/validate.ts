import type { z } from "zod";

/**
 * Saved-prop validation with fallback (M5). Stored content can predate the
 * schema (a field added, a type narrowed); instead of crashing the canvas,
 * invalid props fall back to defaults with a dev-only warning.
 */
export function validateProps<P>(schema: z.ZodType<P>, saved: unknown, defaults: P): P {
  const result = schema.safeParse(saved);
  if (result.success) return result.data;
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "[builder] saved props failed validation, falling back to defaults:",
      result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "),
    );
  }
  return defaults;
}
