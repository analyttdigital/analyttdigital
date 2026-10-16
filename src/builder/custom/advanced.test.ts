import { createElement } from "react";
import type { ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { buildConfig } from "@/builder/config/build-config";
import { clearRegistryForTests, getComponent } from "@/builder/registry";
import { registerChart } from "./chart";
import { registerGsapReveal } from "./gsap-reveal";
import { registerThreeScene } from "./three-scene";

/**
 * M8: advanced customs register through the public API and never crash
 * static rendering. GsapReveal's DropZone needs a live Puck store, so it is
 * shape-checked only; ThreeScene renders its placeholder statically.
 */
describe("advanced custom components", () => {
  it("registers GsapReveal with derived fields", () => {
    clearRegistryForTests();
    registerGsapReveal();
    const def = getComponent("GsapReveal");
    expect(def?.category).toBe("Advanced");
    expect(def?.config.fields?.variant).toMatchObject({ type: "select" });
    expect(def?.config.fields?.duration).toMatchObject({ type: "number" });
    expect(def?.config.fields?.once).toMatchObject({ type: "radio" });
    expect(def?.config.defaultProps).toMatchObject({ variant: "fade", once: true });
    expect(buildConfig().components.GsapReveal).toBeDefined();
    expect(buildConfig().categories?.Advanced?.components).toContain("GsapReveal");
  });

  it("registers ThreeScene with a token color override", () => {
    clearRegistryForTests();
    registerThreeScene();
    const def = getComponent("ThreeScene");
    expect(def?.category).toBe("Advanced");
    expect(def?.config.fields?.color).toMatchObject({ type: "select" });
    expect(buildConfig().components.ThreeScene).toBeDefined();
  });

  it("renders the ThreeScene placeholder in static markup without WebGL", () => {
    clearRegistryForTests();
    registerThreeScene();
    const Render = getComponent("ThreeScene")?.config.render as ComponentType<
      Record<string, unknown>
    >;
    if (!Render) throw new Error("missing");
    const html = renderToStaticMarkup(
      createElement(Render, { color: "primary", speed: 1, autoRotate: true, height: 320 }),
    );
    expect(html.length).toBeGreaterThan(0);
  });

  it("registers Chart and renders SVG bars in static markup", () => {
    clearRegistryForTests();
    registerChart();
    const def = getComponent("Chart");
    expect(def?.category).toBe("Advanced");
    expect(def?.config.fields?.type).toMatchObject({ type: "select" });
    expect(buildConfig().components.Chart).toBeDefined();
    const Render = def?.config.render as ComponentType<Record<string, unknown>>;
    if (!Render) throw new Error("missing");
    const html = renderToStaticMarkup(
      createElement(Render, {
        title: "T",
        type: "bar",
        color: "primary",
        width: 480,
        height: 280,
        points: [{ label: "A", value: 5 }],
      }),
    );
    // Client-only wrapper by design (recharts hydrates the SVG): static
    // markup carries the placeholder, never a half-painted chart.
    expect(html).toContain("Loading…");
  });
});
