import { z } from "zod";

export const RowSchema = z.object({
  gap: z.number().min(0).max(8).default(4),
  align: z.enum(["start", "center", "end", "stretch"]).default("stretch"),
  stackOnMobile: z.boolean().default(true),
});

export type RowProps = z.infer<typeof RowSchema>;

export const rowDefaults: RowProps = {
  gap: 4,
  align: "stretch",
  stackOnMobile: true,
};
