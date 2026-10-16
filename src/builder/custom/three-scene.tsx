import dynamic from "next/dynamic";
import { mdiCube } from "@mdi/js";
import { z } from "zod";

import { registerComponent } from "@/builder/registry";
import type { RegisterComponentOptions } from "@/builder/registry";
import { TEXT_COLOR_OPTIONS } from "@/builder/components/shared";
import { defaultTheme } from "@/builder/theme/defaults";

/**
 * Three.js scene (M8). The R3F canvas splits into its own chunk via
 * `next/dynamic(ssr:false)` and never mounts while editing — a live WebGL
 * canvas would steal pointer events from the Puck canvas. Token colors
 * resolve to concrete hex through the default theme (three.js needs real
 * color values, not CSS variables).
 */

const ThreeCanvas = dynamic(() => import("./three-canvas").then((m) => ({ default: m.ThreeCanvas })), {
  ssr: false,
  loading: () => (
    <div className="font-bldBody text-bld-muted text-sm" style={{ padding: 24, textAlign: "center" }}>
      Loading 3D…
    </div>
  ),
});

export const ThreeSceneSchema = z.object({
  color: z.string().describe("Color").default("primary"),
  speed: z.number().describe("Rotation speed").default(1),
  autoRotate: z.boolean().describe("Auto rotate").default(true),
  height: z.number().describe("Height (px)").default(320),
});

export type ThreeSceneProps = z.infer<typeof ThreeSceneSchema>;

function Placeholder({ label }: { label: string }) {
  return (
    <div
      className="bg-bld-surface text-bld-muted font-bldBody text-sm"
      style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      {label}
    </div>
  );
}

export function ThreeScene({ color, speed, autoRotate, height, editing }: ThreeSceneProps & { editing?: boolean }) {
  if (editing) return <Placeholder label="3D scene (disabled while editing)" />;
  const hex = defaultTheme.colors[color as keyof typeof defaultTheme.colors]?.light ?? color;
  return (
    <div style={{ height, width: "100%" }}>
      <ThreeCanvas color={hex} speed={speed} autoRotate={autoRotate} />
    </div>
  );
}

export const threeSceneOptions: RegisterComponentOptions<ThreeSceneProps> = {
  name: "ThreeScene",
  label: "3D scene",
  category: "Advanced",
  icon: mdiCube,
  schema: ThreeSceneSchema,
  fields: {
    color: { type: "select", label: "Color", options: TEXT_COLOR_OPTIONS },
  },
  render: ThreeScene,
};

export function registerThreeScene(): void {
  registerComponent(threeSceneOptions);
}

registerThreeScene();
