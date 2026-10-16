import { describe, expect, it } from "vitest";

import { blankLayoutsFile } from "@/builder/schema/shared";
import { resolveLayout } from "./layout";

describe("resolveLayout", () => {
  it("finds the requested layout by id", () => {
    const layouts = blankLayoutsFile();
    expect(resolveLayout(layouts, "default").id).toBe("default");
  });

  it("falls back to the default layout, then the first, then blank", () => {
    const layouts = blankLayoutsFile();
    expect(resolveLayout(layouts, "missing").id).toBe("default");
    expect(resolveLayout({ schemaVersion: 1, layouts: [] }, "missing").id).toBe("default");
  });

  it("keeps dashboard shell settings on the resolved entry", () => {
    const layouts = {
      schemaVersion: 1 as const,
      layouts: [
        {
          id: "app",
          name: "App",
          header: "header",
          footer: null,
          announcement: null,
          sidebar: "sidebar",
          shell: "dashboard" as const,
        },
      ],
    };
    expect(resolveLayout(layouts, "app")).toMatchObject({ shell: "dashboard", sidebar: "sidebar" });
  });
});
