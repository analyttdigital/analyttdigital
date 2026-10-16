import { createElement } from "react";
import type { ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { vi } from "vitest";
import { z } from "zod";
import { describe, expect, it } from "vitest";

import { buildConfig } from "@/builder/config/build-config";
import {
  getComponent,
  listComponents,
  registerComponent,
} from "@/builder/registry";
import { validateProps } from "./validate";

const widgetSchema = z.object({
  title: z.string().describe("Title").default("Widget"),
  count: z.number().default(1),
});

function Widget(props: { title: string; count: number; editing?: boolean }) {
  return createElement("div", null, `${props.title}:${props.count}:${props.editing === true}`);
}

describe("registerComponent (M5 schema-first API)", () => {
  it("derives fields, validates defaults, and lands in the palette", () => {
    registerComponent({
      name: "M5Widget",
      label: "Widget",
      category: "M5",
      icon: "M0,0h24v24H0z",
      schema: widgetSchema,
      render: Widget,
    });
    const def = getComponent("M5Widget");
    expect(def?.category).toBe("M5");
    expect(def?.icon).toBe("M0,0h24v24H0z");
    expect(def?.config.fields?.title).toMatchObject({ type: "text", label: "Title" });
    expect(def?.config.fields?.count).toMatchObject({ type: "number" });
    expect(def?.config.defaultProps).toEqual({ title: "Widget", count: 1 });
    // Palette presence with no core edits.
    expect(buildConfig().components.M5Widget).toBeDefined();
    expect(buildConfig().categories?.M5?.components).toContain("M5Widget");
    expect(listComponents().some((d) => d.name === "M5Widget")).toBe(true);
  });

  it("derives defaultProps from the schema when omitted", () => {
    registerComponent({
      name: "M5Derived",
      schema: widgetSchema,
      render: Widget,
    });
    expect(getComponent("M5Derived")?.config.defaultProps).toEqual({ title: "Widget", count: 1 });
  });

  it("merges explicit fields over derived ones", () => {
    registerComponent({
      name: "M5Override",
      schema: widgetSchema,
      fields: { title: { type: "textarea", label: "Custom" } },
      render: Widget,
    });
    const fields = getComponent("M5Override")?.config.fields;
    expect(fields?.title).toMatchObject({ type: "textarea", label: "Custom" });
    expect(fields?.count).toMatchObject({ type: "number" });
  });

  it("rejects invalid defaultProps and schemas that need explicit defaults", () => {
    expect(() =>
      registerComponent({
        name: "M5Bad",
        schema: widgetSchema,
        defaultProps: { title: "x", count: "NaN" } as unknown as { title: string; count: number },
        render: Widget,
      }),
    ).toThrow(/defaultProps failed/);
    expect(() =>
      registerComponent({
        name: "M5Required",
        schema: z.object({ must: z.string() }),
        render: () => null,
      }),
    ).toThrow(/explicit `defaultProps`/);
  });

  it("falls back to defaults on invalid saved props (dev warning silenced)", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const out = validateProps(widgetSchema, { title: "ok", count: "bad" }, { title: "d", count: 0 });
    expect(out).toEqual({ title: "d", count: 0 });
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
    expect(validateProps(widgetSchema, { title: "ok", count: 2 }, { title: "d", count: 0 })).toEqual({
      title: "ok",
      count: 2,
    });
  });

  it("injects the editing flag into renders", () => {
    registerComponent({
      name: "M5Editing",
      schema: widgetSchema,
      render: Widget,
    });
    const Render = getComponent("M5Editing")?.config.render;
    if (!Render) throw new Error("missing");
    const html = renderToStaticMarkup(
      createElement(Render as ComponentType<Record<string, unknown>>, { title: "T", count: 1 }),
    );
    // Outside an EditingProvider the flag defaults to false.
    expect(html).toContain("T:1:false");
  });

  it("renders a loading placeholder for client-only components in static markup", () => {
    registerComponent({
      name: "M5Client",
      schema: widgetSchema,
      render: Widget,
      client: true,
    });
    const Render = getComponent("M5Client")?.config.render;
    if (!Render) throw new Error("missing");
    const html = renderToStaticMarkup(
      createElement(Render as ComponentType<Record<string, unknown>>, { title: "T", count: 1 }),
    );
    expect(html).toContain("Loading…");
  });
});
