import type { ComponentConfig, Fields } from "@measured/puck";
import type { ComponentType } from "react";
import type { ReactElement, ReactNode } from "react";
import type { z } from "zod";

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
  /** MDI path for palette surfaces that render icons (Puck's own list is text-only). */
  icon?: string;
  /** Puck-native component config (fields, render, defaultProps, ...). */
  config: RegisteredComponentConfig;
}

/**
 * M5 registration options (PROJECT.md 3.4). The Zod schema is the source of
 * truth: editor fields derive from it unless `fields` overrides per key, and
 * saved props validate against it with fallback to defaults.
 */
export interface RegisterComponentOptions<P extends Record<string, unknown>> {
  /** Unique PascalCase name, e.g. `ThreeScene`. */
  name: string;
  /** Palette label. Defaults to the name. */
  label?: string;
  /** Palette category. Defaults to `Advanced`. */
  category?: string;
  /** MDI path shown on palette surfaces that render icons. */
  icon?: string;
  /** Source of truth for props, fields, and validation. Must be a Zod object. */
  schema: z.ZodType<P>;
  /** Per-key overrides; merged over derived fields. Required for unmappable types. */
  fields?: Fields;
  /** Defaults. When omitted, derived via `schema.parse({})` (throws unless every key has a default). */
  defaultProps?: P;
  /** Receives validated props + `{ editing }`. */
  render: ComponentType<P & { editing?: boolean }>;
  /** `true` (or `{ loading }`) wraps the render client-only (`ssr: false`). Heavy libs must still lazy-import inside. */
  client?: boolean | { loading?: ReactNode };
}

/**
 * Author-facing definition helper (M4). Component files declare fully
 * inferred prop types; Puck instead wants its own augmented props
 * (`WithPuckProps`), which is invariance-incompatible with narrow renders.
 * The adaptation is confined to this one function so authors never cast.
 * `fields` stays Puck-loose here on purpose: M5 will *derive* fields from
 * the Zod schema, removing the fields↔props drift class entirely.
 */
export function defineComponent<P extends Record<string, unknown>>(def: {
  name: string;
  label?: string;
  category?: string;
  fields: Fields;
  defaultProps: P;
  render: ComponentType<P>;
}): BuilderComponentDefinition {
  const render = def.render as (props: P) => ReactElement | null;
  return {
    name: def.name,
    label: def.label,
    category: def.category,
    config: {
      fields: def.fields,
      defaultProps: def.defaultProps,
      render: render as RegisteredComponentConfig["render"],
    },
  };
}
