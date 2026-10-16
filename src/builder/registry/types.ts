import type { ComponentConfig } from "@measured/puck";

/**
 * Registry component definition (M3 plumbing). Stores Puck-native configs;
 * M5 extends this API with Zod-schema-to-fields derivation, the
 * dynamic/SSR-off wrapper option, and prop validation with fallbacks.
 */
export type RegisteredComponentConfig = Omit<ComponentConfig, "type">;

export interface BuilderComponentDefinition {
  /** Unique PascalCase name, e.g. `ThreeScene`. */
  name: string;
  /** Palette label. Defaults to the name. */
  label?: string;
  /** Palette category. Defaults to `General`. */
  category?: string;
  /** Puck-native component config (fields, render, defaultProps, ...). */
  config: RegisteredComponentConfig;
}
