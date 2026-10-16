import { describe, expect, it } from "vitest";

import { builderSitemapUrls, renderSitemap } from "@/pages/sitemap.xml";

describe("builder sitemap", () => {
  it("maps slugs to public routes", () => {
    expect(builderSitemapUrls(["home", "pricing"])).toEqual(["/p", "/p/pricing"]);
  });

  it("renders valid XML with escaped origins", () => {
    const xml = renderSitemap(["/p", "/p/a&b"], "https://example.test");
    expect(xml).toContain("<loc>https://example.test/p</loc>");
    expect(xml).toContain("a&amp;b");
    expect(xml.startsWith('<?xml version="1.0"')).toBe(true);
  });
});
