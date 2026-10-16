import { mdiChartBar } from "@mdi/js";
import { z } from "zod";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { registerComponent } from "@/builder/registry";
import type { RegisterComponentOptions } from "@/builder/registry";
import { TEXT_COLOR_OPTIONS } from "@/builder/components/shared";
import { defaultTheme } from "@/builder/theme/defaults";

/**
 * Chart component (M8, recharts per user choice). Fixed dimensions keep
 * server rendering deterministic (no ResizeObserver on first paint);
 * recharts draws plain SVG identically in editor and public views. Token
 * colors resolve to concrete hex through the default theme — SVG
 * presentation attributes cannot consume CSS variables.
 */

export const ChartPointSchema = z.object({
  label: z.string().default(""),
  value: z.number().default(0),
});

export const ChartSchema = z.object({
  title: z.string().describe("Title").default("Signups by day"),
  type: z.enum(["bar", "line"]).describe("Type").default("bar"),
  color: z.string().describe("Color").default("primary"),
  width: z.number().describe("Width (px)").default(480),
  height: z.number().describe("Height (px)").default(280),
  points: z
    .array(ChartPointSchema)
    .describe("Data")
    .default([
      { label: "Mon", value: 30 },
      { label: "Tue", value: 55 },
      { label: "Wed", value: 40 },
      { label: "Thu", value: 70 },
      { label: "Fri", value: 90 },
    ]),
});

export type ChartProps = z.infer<typeof ChartSchema>;

export function Chart({ title, type, color, width, height, points }: ChartProps) {
  const hex =
    defaultTheme.colors[color as keyof typeof defaultTheme.colors]?.light ?? color;
  const data = points.map((p) => ({ ...p }));
  return (
    <figure className="font-bldBody" style={{ margin: 0 }}>
      <figcaption className="text-bld-text" style={{ fontWeight: 600, marginBottom: 8 }}>
        {title}
      </figcaption>
      {type === "bar" ? (
        <BarChart width={width} height={height} data={data} role="img" aria-label={title}>
          <CartesianGrid stroke="var(--bld-color-border)" strokeDasharray="3 3" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="value" fill={hex} radius={[4, 4, 0, 0]} />
        </BarChart>
      ) : (
        <LineChart width={width} height={height} data={data} role="img" aria-label={title}>
          <CartesianGrid stroke="var(--bld-color-border)" strokeDasharray="3 3" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke={hex} strokeWidth={2} dot={false} />
        </LineChart>
      )}
    </figure>
  );
}

export const chartOptions: RegisterComponentOptions<ChartProps> = {
  name: "Chart",
  label: "Chart",
  category: "Advanced",
  icon: mdiChartBar,
  schema: ChartSchema,
  fields: {
    color: { type: "select", label: "Color", options: TEXT_COLOR_OPTIONS },
  },
  // Recharts paints on hydration (ResizeObserver/effects); SSR yields an
  // empty wrapper, so skip SSR and split the chunk to the client instead.
  client: true,
  render: Chart,
};

export function registerChart(): void {
  registerComponent(chartOptions);
}

registerChart();
