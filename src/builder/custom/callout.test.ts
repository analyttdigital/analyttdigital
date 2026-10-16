import { describe, expect, it } from "vitest";

import { buildConfig } from "@/builder/config/build-config";
import { clearRegistryForTests, getComponent } from "@/builder/registry";
import { registerCallout } from "./callout";

/**
 * M5 acceptance: one file in `custom/` + one `registerComponent` call puts
 * a component in the palette with no core edits. Re-registration is explicit
 * here so the test never depends on import-time side effects.
 */
describe("custom Callout", () => {
  it("registers through the public API and appears in the palette", () => {
    // Import side effects may already have registered it in this env.
    clearRegistryForTests();
    registerCallout();
    expect(getComponent("Callout")?.category).toBe("Custom");
    const config = buildConfig();
    expect(Object.keys(config.components)).toContain("Callout");
    expect(config.categories?.Custom?.components).toContain("Callout");
  });
});
