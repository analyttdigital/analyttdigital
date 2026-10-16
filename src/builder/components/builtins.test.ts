import { createElement } from "react";
import type { ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { buildConfig } from "@/builder/config/build-config";
import { BUILT_IN_COUNT, builtInComponents } from "./builtins";
import { EditingProvider } from "@/builder/render/editing";
import { clearRegistryForTests } from "@/builder/registry";

/**
 * M4 acceptance: every built-in has fields + defaults + a render, and that
 * single render function serves both editor and public views. Leaf components
 * render to static markup here (inside the editing flag, so placeholders
 * show); DropZone containers are shape-checked only — their children need a
 * live Puck store, which the editor + `/p` renderer provide.
 */

const DROP_ZONE_COMPONENTS = new Set([
  "Section",
  "Container",
  "Row",
  "Column",
  "Grid",
  "Card",
  "Form",
]);

describe("built-in components", () => {
  it("ships the full inventory through the registry (no hard wiring)", () => {
    expect(BUILT_IN_COUNT).toBe(29);
    clearRegistryForTests();
    const config = buildConfig();
    expect(Object.keys(config.components).sort()).toEqual(
      builtInComponents.map((d) => d.name).sort(),
    );
  });

  it("gives every component fields, defaults, and a render", () => {
    for (const def of builtInComponents) {
      expect(def.config.fields, def.name).toBeDefined();
      expect(def.config.defaultProps, def.name).toBeDefined();
      expect(typeof def.config.render, def.name).toBe("function");
    }
  });

  it("renders every leaf component to non-empty markup from defaults", () => {
    for (const def of builtInComponents) {
      if (DROP_ZONE_COMPONENTS.has(def.name)) continue;
      // Test-local casts: Puck's render signature carries editor-only props
      // (puck context, id) that static rendering never provides. The raw
      // component functions take plain props; the cast only bridges Puck's
      // augmented type, it does not change what renders.
      const Render = def.config.render as ComponentType<Record<string, unknown>>;
      const props = (def.config.defaultProps ?? {}) as Record<string, unknown>;
      const html = renderToStaticMarkup(
        createElement(EditingProvider, {
          editing: true,
          children: createElement(Render, props),
        }),
      );
      expect(html.length, def.name).toBeGreaterThan(0);
    }
  });

  it("uses token classes (no hardcoded hex) in leaf markup", () => {
    for (const def of builtInComponents) {
      if (DROP_ZONE_COMPONENTS.has(def.name)) continue;
      const Render = def.config.render as ComponentType<Record<string, unknown>>;
      const props = (def.config.defaultProps ?? {}) as Record<string, unknown>;
      const html = renderToStaticMarkup(
        createElement(EditingProvider, {
          editing: true,
          children: createElement(Render, props),
        }),
      );
      expect(html, def.name).not.toMatch(/#[0-9a-fA-F]{6}/);
    }
  });
});
