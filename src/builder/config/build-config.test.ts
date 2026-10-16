import { createElement } from "react";
import { beforeEach, describe, expect, it } from "vitest";

import { buildConfig } from "./build-config";
import {
  clearRegistryForTests,
  defineComponent,
  getComponent,
  listComponents,
  registerComponent,
} from "@/builder/registry";

beforeEach(() => {
  clearRegistryForTests();
});

describe("registry + buildConfig", () => {
  it("always includes built-ins, even after a registry clear", () => {
    clearRegistryForTests();
    const config = buildConfig();
    expect(Object.keys(config.components)).toHaveLength(29);
    expect(listComponents()).toHaveLength(29);
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
    expect(Object.keys(config.components)).toEqual(["Hello"]);
    expect(config.categories?.Basic?.components).toEqual(["Hello"]);
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
    expect(Object.keys(config.components).sort()).toEqual(["A", "B"]);
    expect(config.categories?.Zed?.components).toEqual(["A"]);
    expect(config.categories?.General?.components).toEqual(["B"]);
  });
});
