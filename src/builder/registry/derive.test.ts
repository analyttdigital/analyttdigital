import { z } from "zod";
import { describe, expect, it } from "vitest";

import { schemaToFields } from "./derive";

describe("schemaToFields", () => {
  it("maps scalars, enums, and descriptions to labeled fields", () => {
    const fields = schemaToFields(
      z.object({
        title: z.string().describe("Title"),
        count: z.number(),
        flag: z.boolean(),
        choice: z.enum(["a", "b"]),
      }),
    );
    expect(fields.title).toMatchObject({ type: "text", label: "Title" });
    expect(fields.count).toMatchObject({ type: "number", label: "count" });
    expect(fields.flag).toMatchObject({ type: "radio", label: "flag" });
    expect(fields.choice).toMatchObject({
      type: "select",
      options: [
        { label: "a", value: "a" },
        { label: "b", value: "b" },
      ],
    });
  });

  it("unwraps optional/default/nullable and skips literals", () => {
    const fields = schemaToFields(
      z.object({
        maybe: z.string().optional(),
        withDefault: z.number().default(3),
        orNull: z.boolean().nullable(),
        fixed: z.literal("x"),
      }),
    );
    expect(fields.maybe).toMatchObject({ type: "text" });
    expect(fields.withDefault).toMatchObject({ type: "number" });
    expect(fields.orNull).toMatchObject({ type: "radio" });
    expect(fields).not.toHaveProperty("fixed");
  });

  it("derives nested arrays of objects with summaries and defaults", () => {
    const fields = schemaToFields(
      z.object({
        rows: z.array(z.object({ label: z.string(), value: z.number().default(1) })),
      }),
    );
    const rows = fields.rows;
    expect(rows).toMatchObject({ type: "array", label: "rows" });
    if (rows?.type !== "array") throw new Error("expected array field");
    expect(rows.arrayFields.label).toMatchObject({ type: "text" });
    // `label` is required without a default, so item defaults fall back to {}.
    expect(rows.defaultItemProps).toEqual({});
  });

  it("derives nested objects", () => {
    const fields = schemaToFields(z.object({ box: z.object({ w: z.number() }) }));
    expect(fields.box).toMatchObject({ type: "object" });
    if (fields.box?.type !== "object") throw new Error("expected object field");
    expect(fields.box.objectFields.w).toMatchObject({ type: "number" });
  });

  it("throws helpfully for unmappable types and non-object schemas", () => {
    expect(() => schemaToFields(z.object({ when: z.date() }))).toThrow(/fields.*override/);
    expect(() => schemaToFields(z.object({ tags: z.array(z.string()) }))).toThrow(/must hold objects/);
    expect(() => schemaToFields(z.string())).toThrow(/must be a Zod object/);
  });
});
