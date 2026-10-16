import { z } from "zod";

export const TextSchema = z.object({
  content: z.string().default("Body copy."),
  size: z.string().default("base"),
  align: z.enum(["left", "center", "right"]).default("left"),
  color: z.string().default("text"),
  weight: z.enum(["regular", "medium", "bold"]).default("regular"),
});

export type TextProps = z.infer<typeof TextSchema>;

export const textDefaults: TextProps = {
  content: "Body copy.",
  size: "base",
  align: "left",
  color: "text",
  weight: "regular",
};
