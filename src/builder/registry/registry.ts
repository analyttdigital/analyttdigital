import type { BuilderComponentDefinition } from "./types";

/**
 * Minimal component registry (M3). `buildConfig()` reads everything from
 * here, so adding a component never touches core files. M5 adds schema
 * derivation and the dynamic-import wrapper on top of this map.
 */

const NAME_RE = /^[A-Z][A-Za-z0-9]*$/;

const components = new Map<string, BuilderComponentDefinition>();

export function registerComponent(def: BuilderComponentDefinition): void {
  if (!NAME_RE.test(def.name)) {
    throw new Error(`Invalid component name "${def.name}": use unique PascalCase`);
  }
  if (components.has(def.name)) {
    throw new Error(`Component "${def.name}" is already registered`);
  }
  components.set(def.name, def);
}

export function getComponent(name: string): BuilderComponentDefinition | undefined {
  return components.get(name);
}

export function listComponents(): BuilderComponentDefinition[] {
  return [...components.values()].sort((a, b) =>
    (a.category ?? "General").localeCompare(b.category ?? "General") ||
    (a.label ?? a.name).localeCompare(b.label ?? b.name),
  );
}

/** Test-only: empty the registry between cases. */
export function clearRegistryForTests(): void {
  components.clear();
}
