import { z } from "zod";

export const DividerSchema = z.object({
  color: z.string().default("border"),
  thickness: z.number().min(1).max(4).default(1),
  marginY: z.number().min(0).max(8).default(4),
});

export type DividerProps = z.infer<typeof DividerSchema>;

export const dividerDefaults: DividerProps = {
  color: "border",
  thickness: 1,
  marginY: 4,
};
