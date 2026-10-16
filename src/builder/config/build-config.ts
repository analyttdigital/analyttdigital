import type { Config } from "@measured/puck";

import { listComponents } from "@/builder/registry";
import { ensureBuiltInsRegistered } from "@/builder/components/builtins";
// Project customs self-register on import (M5); the palette is built-ins plus
// everything registered here, with no other core edits.
import "@/builder/custom";

/**
 * Assembles the Puck config (M3): every registered component plus an (empty)
 * root. Components are never hard wired here — built-ins self-register from
 * `src/builder/components/builtins.ts`, customs from `src/builder/custom/`
 * (M5); both go through the registry API.
 */
export function buildConfig(): Config {
  ensureBuiltInsRegistered();
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
