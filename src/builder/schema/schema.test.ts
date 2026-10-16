import { describe, expect, it } from "vitest";

import { defaultTheme } from "@/builder/theme/defaults";
import { PageSchema, blankPage, fileToSlug, slugToFile } from "./page";
import { LayoutsFileSchema, SharedDocSchema, assertValidSharedDoc } from "./shared";
import { parseThemeFile } from "./theme-file";

describe("builder schemas", () => {
  it("accepts a blank page", () => {
    expect(() => PageSchema.parse(blankPage("home"))).not.toThrow();
  });

  it("rejects pages with a bad path or schema version", () => {
    const page = blankPage("home");
    expect(() =>
      PageSchema.parse({ ...page, meta: { ...page.meta, path: "no-leading-slash" } }),
    ).toThrow();
    expect(() => PageSchema.parse({ ...page, schemaVersion: 2 })).toThrow();
  });

  it("round-trips slugs to files", () => {
    expect(slugToFile("home")).toBe("pages/home.json");
    expect(fileToSlug("pages/home.json")).toBe("home");
    expect(fileToSlug("pages/notes.txt")).toBeNull();
    expect(() => slugToFile("Bad Slug")).toThrow();
    expect(() => slugToFile("../escape")).toThrow();
  });

  it("accepts shared docs and layouts files", () => {
    expect(() =>
      SharedDocSchema.parse({ schemaVersion: 1, puck: { content: [], root: { props: {} }, zones: {} } }),
    ).not.toThrow();
    expect(() =>
      LayoutsFileSchema.parse({
        schemaVersion: 1,
        layouts: [{ id: "default", name: "Default", header: "header", footer: "footer" }],
      }),
    ).not.toThrow();
    expect(() => assertValidSharedDoc("sidebar")).toThrow();
  });

  it("accepts the default theme file", () => {
    expect(parseThemeFile(defaultTheme)).toEqual(defaultTheme);
    expect(() => parseThemeFile({ ...defaultTheme, colors: {} })).toThrow();
  });
});
