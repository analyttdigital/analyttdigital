import { describe, expect, it } from "vitest";

import { defaultTheme } from "@/builder/theme/defaults";
import { PageSchema, blankPage, fileToSlug, slugToFile } from "./page";
import {
  LayoutsFileSchema,
  SharedDocSchema,
  assertValidSharedDocName,
  blankLayoutsFile,
} from "./shared";
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
    // Layout defaults fill in: only the id is required.
    const minimal = LayoutsFileSchema.parse({ schemaVersion: 1, layouts: [{ id: "x" }] });
    expect(minimal.layouts[0]).toMatchObject({
      header: null,
      footer: null,
      announcement: null,
      sidebar: null,
      shell: "page",
    });
    expect(() => assertValidSharedDocName("Bad Doc")).toThrow();
    expect(() => assertValidSharedDocName("announcement")).not.toThrow();
    expect(blankLayoutsFile().layouts[0].id).toBe("default");
  });

  it("accepts the default theme file", () => {
    expect(parseThemeFile(defaultTheme)).toEqual(defaultTheme);
    expect(() => parseThemeFile({ ...defaultTheme, colors: {} })).toThrow();
  });
});
