import { z } from "zod";
import type { Field, Fields } from "@measured/puck";

/**
 * Zod-schema-to-Puck-fields derivation (M5). A component author writes one
 * Zod object schema; the editor form falls out of it. Explicit `fields`
 * passed to `registerComponent` merge *over* derived ones per key, so custom
 * M1 fields (token-aware color, radius, fonts) stay available.
 *
 * Supported: string, number, boolean, enum, literal (skipped — fixed value),
 * arrays of objects, nested objects, and optional/default/nullable wrappers.
 * Anything else throws at registration with a pointer to the `fields`
 * override — a loud error beats a silently wrong editor form.
 */

type AnySchema = z.ZodTypeAny;

function typeName(schema: AnySchema): string {
  const def = schema._def as { type?: unknown };
  return typeof def.type === "string" ? def.type : "unknown";
}

function unwrap(schema: AnySchema): AnySchema {
  let current = schema;
  while (
    current instanceof z.ZodOptional ||
    current instanceof z.ZodDefault ||
    current instanceof z.ZodNullable
  ) {
    current = current._def.innerType as AnySchema;
  }
  return current;
}

function labelOf(schema: AnySchema, fallback: string): string {
  // `.describe()` may sit inside or outside optional/default wrappers.
  if (schema.description) return schema.description;
  return unwrap(schema).description ?? fallback;
}

function summaryField(shape: Record<string, AnySchema>): string | null {
  for (const [key, sub] of Object.entries(shape)) {
    if (unwrap(sub) instanceof z.ZodString) return key;
  }
  return null;
}

function fieldFor(schema: AnySchema, key: string): Field | undefined {
  const inner = unwrap(schema);
  const label = labelOf(schema, key);

  if (inner instanceof z.ZodString) return { type: "text", label };
  if (inner instanceof z.ZodNumber) return { type: "number", label };
  if (inner instanceof z.ZodBoolean) {
    return {
      type: "radio",
      label,
      options: [
        { label: "No", value: false },
        { label: "Yes", value: true },
      ],
    };
  }
  if (inner instanceof z.ZodEnum) {
    return {
      type: "select",
      label,
      options: inner.options.map((o) => ({ label: String(o), value: o })),
    };
  }
  if (inner instanceof z.ZodLiteral) return undefined;
  if (inner instanceof z.ZodArray) {
    const element = unwrap(inner._def.element as AnySchema);
    if (!(element instanceof z.ZodObject)) {
      throw new Error(
        `schemaToFields: array "${key}" must hold objects (Puck array items are objects). ` +
          `Restructure the schema or pass an explicit \`fields\` override.`,
      );
    }
    const subShape = element.shape as Record<string, AnySchema>;
    const summaryKey = summaryField(subShape);
    let defaultItemProps: Record<string, unknown> = {};
    try {
      defaultItemProps = element.parse({}) as Record<string, unknown>;
    } catch {
      defaultItemProps = {};
    }
    return {
      type: "array",
      label,
      arrayFields: schemaToFields(element),
      defaultItemProps,
      getItemSummary: (item, index) => {
        const row = item as Record<string, unknown>;
        if (summaryKey && typeof row[summaryKey] === "string" && row[summaryKey] !== "") {
          return row[summaryKey] as string;
        }
        return `Item ${(index ?? 0) + 1}`;
      },
    };
  }
  if (inner instanceof z.ZodObject) {
    return { type: "object", label, objectFields: schemaToFields(inner) };
  }
  throw new Error(
    `schemaToFields: no field mapping for "${key}" (zod ${typeName(inner)}). ` +
      `Pass an explicit \`fields\` override for this key.`,
  );
}

export function schemaToFields(schema: AnySchema): Fields {
  const root = unwrap(schema);
  if (!(root instanceof z.ZodObject)) {
    throw new Error(
      "schemaToFields: component schema must be a Zod object (or pass explicit `fields`).",
    );
  }
  const out: Record<string, Field> = {};
  for (const [key, sub] of Object.entries(root.shape as Record<string, AnySchema>)) {
    const field = fieldFor(sub, key);
    if (field !== undefined) out[key] = field;
  }
  return out;
}
