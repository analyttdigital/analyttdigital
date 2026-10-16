import type { Config } from "@measured/puck";

import { listComponents } from "@/builder/registry";

/**
 * Assembles the Puck config (M3): every registered component plus an (empty)
 * root. Components are never hard wired here — registration in
 * `src/builder/custom/index.ts` (M5) is the only way in. Built-ins arrive
 * with M4, so the palette starts empty by design.
 */
export function buildConfig(): Config {
  const components: Config["components"] = {};
  const categories: NonNullable<Config["categories"]> = {};

  for (const def of listComponents()) {
    components[def.name] = def.config;
    const category = def.category ?? "General";
    categories[category] ??= { components: [] };
    categories[category].components?.push(def.name);
  }

  return {
    categories,
    components,
    root: {},
  };
}
