import { createElement } from "react";
import { beforeEach, describe, expect, it } from "vitest";

import { buildConfig } from "./build-config";
import { builtInComponents } from "@/builder/components/builtins";
import {
  clearRegistryForTests,
  defineComponent,
  getComponent,
  registerComponent,
} from "@/builder/registry";

beforeEach(() => {
  clearRegistryForTests();
});

describe("registry + buildConfig", () => {
  it("always includes built-ins, even after a registry clear", () => {
    clearRegistryForTests();
    const config = buildConfig();
    for (const def of builtInComponents) {
      expect(Object.keys(config.components)).toContain(def.name);
    }
  });

  it("registers a component once, under its category", () => {
    registerComponent(
      defineComponent({
        name: "Hello",
        label: "Hello",
        category: "Basic",
        fields: { title: { type: "text" } },
        defaultProps: { title: "Hi" },
        render: () => createElement("div"),
      }),
    );
    expect(getComponent("Hello")?.label).toBe("Hello");
    const config = buildConfig();
    expect(Object.keys(config.components)).toContain("Hello");
    expect(config.categories?.Basic?.components).toContain("Hello");
  });

  it("rejects duplicates and non-PascalCase names", () => {
    const def = defineComponent({
      name: "Hello",
      fields: {},
      defaultProps: {},
      render: () => createElement("div"),
    });
    registerComponent(def);
    expect(() => registerComponent(def)).toThrow(/already registered/);
    expect(() =>
      registerComponent(
        defineComponent({
          name: "not-pascal",
          fields: {},
          defaultProps: {},
          render: () => createElement("div"),
        }),
      ),
    ).toThrow(/PascalCase/);
  });

  it("never hard wires components: config output equals registry input", () => {
    registerComponent(
      defineComponent({ name: "B", fields: {}, defaultProps: {}, render: () => createElement("div") }),
    );
    registerComponent(
      defineComponent({
        name: "A",
        category: "Zed",
        fields: {},
        defaultProps: {},
        render: () => createElement("div"),
      }),
    );
    const config = buildConfig();
    expect(Object.keys(config.components)).toContain("A");
    expect(Object.keys(config.components)).toContain("B");
    expect(config.categories?.Zed?.components).toContain("A");
    expect(config.categories?.General?.components).toContain("B");
  });
});
