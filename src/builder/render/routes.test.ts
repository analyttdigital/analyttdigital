import { describe, expect, it } from "vitest";

import { fileToRoute, routeToSlug, slugToRoute } from "./routes";

describe("builder public routes", () => {
  it("maps the home slug to /p", () => {
    expect(slugToRoute("home")).toBe("/p");
    expect(slugToRoute("pricing")).toBe("/p/pricing");
  });

  it("maps catch-all segments back to slugs", () => {
    expect(routeToSlug(undefined)).toBe("home");
    expect(routeToSlug([])).toBe("home");
    expect(routeToSlug(["pricing"])).toBe("pricing");
    expect(routeToSlug(["Bad_Slug"])).toBeNull();
    expect(routeToSlug(["a", "b"])).toBeNull();
  });

  it("maps stored files to public routes", () => {
    expect(fileToRoute("pages/home.json")).toBe("/p");
    expect(fileToRoute("pages/pricing.json")).toBe("/p/pricing");
    expect(fileToRoute("pages/notes.txt")).toBeNull();
  });
});
