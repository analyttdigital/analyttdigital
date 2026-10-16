import { createElement } from "react";
import { beforeEach, describe, expect, it } from "vitest";

import { buildConfig } from "./build-config";
import { clearRegistryForTests, getComponent, listComponents, registerComponent } from "@/builder/registry";

beforeEach(() => {
  clearRegistryForTests();
});

describe("registry + buildConfig", () => {
  it("starts empty: no components, no categories", () => {
    const config = buildConfig();
    expect(config.components).toEqual({});
    expect(listComponents()).toEqual([]);
  });

  it("registers a component once, under its category", () => {
    registerComponent({
      name: "Hello",
      label: "Hello",
      category: "Basic",
      config: {
        fields: { title: { type: "text" } },
        defaultProps: { title: "Hi" },
        render: () => createElement("div"),
      },
    });
    expect(getComponent("Hello")?.label).toBe("Hello");
    const config = buildConfig();
    expect(Object.keys(config.components)).toEqual(["Hello"]);
    expect(config.categories?.Basic?.components).toEqual(["Hello"]);
  });

  it("rejects duplicates and non-PascalCase names", () => {
    const def = {
      name: "Hello",
      config: { fields: {}, render: () => createElement("div") },
    } as const;
    registerComponent({ ...def });
    expect(() => registerComponent({ ...def })).toThrow(/already registered/);
    expect(() =>
      registerComponent({ name: "not-pascal", config: { fields: {}, render: () => createElement("div") } }),
    ).toThrow(/PascalCase/);
  });

  it("never hard wires components: config output equals registry input", () => {
    registerComponent({ name: "B", config: { fields: {}, render: () => createElement("div") } });
    registerComponent({ name: "A", category: "Zed", config: { fields: {}, render: () => createElement("div") } });
    const config = buildConfig();
    expect(Object.keys(config.components).sort()).toEqual(["A", "B"]);
    expect(config.categories?.Zed?.components).toEqual(["A"]);
    expect(config.categories?.General?.components).toEqual(["B"]);
  });
});
