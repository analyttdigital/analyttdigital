import { z } from "zod";

export const ChartBarSchema = z.object({
  value: z.number().min(0).max(100).default(50),
  label: z.string().default(""),
});

export const ChartPlaceholderSchema = z.object({
  title: z.string().default("Weekly signups"),
  bars: z.array(ChartBarSchema).default([
    { value: 30, label: "Mon" },
    { value: 55, label: "Tue" },
    { value: 40, label: "Wed" },
    { value: 70, label: "Thu" },
    { value: 90, label: "Fri" },
  ]),
  color: z.string().default("primary"),
});

export type ChartPlaceholderProps = z.infer<typeof ChartPlaceholderSchema>;

export const chartPlaceholderDefaults: ChartPlaceholderProps = {
  title: "Weekly signups",
  bars: [
    { value: 30, label: "Mon" },
    { value: 55, label: "Tue" },
    { value: 40, label: "Wed" },
    { value: 70, label: "Thu" },
    { value: 90, label: "Fri" },
  ],
  color: "primary",
};
