import { defineComponent } from "@/builder/registry";
import type { BuilderComponentDefinition } from "@/builder/registry";
import { radiusStyle } from "../../shared";
import { chartPlaceholderDefaults } from "./schema";
import type { ChartPlaceholderProps } from "./schema";
import { chartPlaceholderFields } from "./fields";

// Placeholder until M8 picks a chart library. Static SVG keeps editor and
// public output pixel-identical with no client JS.
const BAR_COLORS: Record<string, string> = {
  primary: "var(--bld-color-primary)",
  accent: "var(--bld-color-accent)",
  success: "var(--bld-color-success)",
};

export function ChartPlaceholder({ title, bars, color }: ChartPlaceholderProps) {
  const width = Math.max(bars.length * 44, 120);
  const height = 160;
  return (
    <figure
      className="bg-bld-surface font-bldBody"
      style={{ ...radiusStyle("md"), padding: 20, margin: 0, boxShadow: "var(--bld-shadow-sm)" }}
    >
      <figcaption className="text-bld-text" style={{ fontWeight: 600, marginBottom: 12 }}>{title}</figcaption>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto" }} role="img" aria-label={title}>
        {bars.map((bar, i) => {
          const h = Math.max((bar.value / 100) * (height - 28), 2);
          return (
            <g key={i}>
              <rect
                x={i * 44 + 8}
                y={height - 24 - h}
                width={28}
                height={h}
                rx={3}
                fill={BAR_COLORS[color] ?? BAR_COLORS.primary}
              />
              {bar.label && (
                <text x={i * 44 + 22} y={height - 8} textAnchor="middle" fontSize={10} fill="var(--bld-color-muted)">
                  {bar.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </figure>
  );
}

export const definition: BuilderComponentDefinition = defineComponent({
  name: "ChartPlaceholder",
  label: "Chart (placeholder)",
  category: "Dashboard",
  fields: chartPlaceholderFields,
  defaultProps: chartPlaceholderDefaults,
  render: ChartPlaceholder,
});
