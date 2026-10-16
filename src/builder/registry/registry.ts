import type { ComponentType } from "react";
import type { ZodTypeAny } from "zod";

import type { BuilderComponentDefinition, RegisterComponentOptions } from "./types";
import { schemaToFields } from "./derive";
import { clientOnly, withBuilderRuntime } from "./runtime";
import { validateProps } from "./validate";

/**
 * Minimal component registry (M3). `buildConfig()` reads everything from
 * here, so adding a component never touches core files. M5 adds schema
 * derivation and the dynamic-import wrapper on top of this map.
 */

const NAME_RE = /^[A-Z][A-Za-z0-9]*$/;

const components = new Map<string, BuilderComponentDefinition>();

function store(def: BuilderComponentDefinition): void {
  if (!NAME_RE.test(def.name)) {
    throw new Error(`Invalid component name "${def.name}": use unique PascalCase`);
  }
  if (components.has(def.name)) {
    throw new Error(`Component "${def.name}" is already registered`);
  }
  components.set(def.name, def);
}

/** M3/M4 shape: a Puck-native definition (see `defineComponent`). */
export function registerComponent(def: BuilderComponentDefinition): void;
/** M5 shape: Zod schema first, fields derived, props validated (see `RegisterComponentOptions`). */
export function registerComponent<P extends Record<string, unknown>>(
  opts: RegisterComponentOptions<P>,
): void;
export function registerComponent(
  defOrOpts: BuilderComponentDefinition | RegisterComponentOptions<Record<string, unknown>>,
): void {
  if (isSchemaOptions(defOrOpts)) {
    store(fromOptions(defOrOpts));
    return;
  }
  store(defOrOpts);
}

function isSchemaOptions(
  def: BuilderComponentDefinition | RegisterComponentOptions<Record<string, unknown>>,
): def is RegisterComponentOptions<Record<string, unknown>> {
  return (
    "schema" in def &&
    (def as Partial<RegisterComponentOptions<Record<string, unknown>>>).schema !== undefined
  );
}

function fromOptions<P extends Record<string, unknown>>(
  opts: RegisterComponentOptions<P>,
): BuilderComponentDefinition {
  let defaults: P;
  if (opts.defaultProps !== undefined) {
    const parsed = opts.schema.safeParse(opts.defaultProps);
    if (!parsed.success) {
      throw new Error(
        `registerComponent("${opts.name}"): defaultProps failed schema validation: ` +
          parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "),
      );
    }
    defaults = parsed.data;
  } else {
    try {
      defaults = opts.schema.parse({});
    } catch {
      throw new Error(
        `registerComponent("${opts.name}"): schema has required props without defaults. ` +
          `Pass explicit \`defaultProps\` or add .default()/.optional() to the schema.`,
      );
    }
  }

  const derived = schemaToFields(opts.schema as unknown as ZodTypeAny);
  const render = withBuilderRuntime(opts.render, (saved) => validateProps(opts.schema, saved, defaults));
  const finalRender = (
    opts.client ? clientOnly(render, typeof opts.client === "object" ? opts.client.loading : undefined) : render
  ) as ComponentType<Record<string, unknown>>;

  return {
    name: opts.name,
    label: opts.label,
    category: opts.category ?? "Advanced",
    icon: opts.icon,
    config: {
      fields: { ...derived, ...opts.fields },
      defaultProps: defaults as Record<string, unknown>,
      render: finalRender as BuilderComponentDefinition["config"]["render"],
    },
  };
}

export function getComponent(name: string): BuilderComponentDefinition | undefined {
  return components.get(name);
}

export function listComponents(): BuilderComponentDefinition[] {
  return [...components.values()].sort(
    (a, b) =>
      (a.category ?? "General").localeCompare(b.category ?? "General") ||
      (a.label ?? a.name).localeCompare(b.label ?? b.name),
  );
}

/** Test-only: empty the registry between cases. */
export function clearRegistryForTests(): void {
  components.clear();
}
