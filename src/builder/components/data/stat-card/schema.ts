import { z } from "zod";

export const StatCardSchema = z.object({
  value: z.string().default("1,248"),
  label: z.string().default("Signups"),
  delta: z.string().default("+12%"),
  direction: z.enum(["up", "down", "flat"]).default("up"),
});

export type StatCardProps = z.infer<typeof StatCardSchema>;

export const statCardDefaults: StatCardProps = {
  value: "1,248",
  label: "Signups",
  delta: "+12%",
  direction: "up",
};
