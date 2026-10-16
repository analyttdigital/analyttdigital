import { z } from "zod";

export const SpacerSchema = z.object({
  height: z.number().min(0).max(16).default(4),
});

export type SpacerProps = z.infer<typeof SpacerSchema>;

export const spacerDefaults: SpacerProps = {
  height: 4,
};
