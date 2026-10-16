import { z } from "zod";

export const RichTextSchema = z.object({
  content: z.string().default("First paragraph.\n\nSecond paragraph with **bold** text."),
  size: z.string().default("base"),
  align: z.enum(["left", "center", "right"]).default("left"),
  color: z.string().default("text"),
});

export type RichTextProps = z.infer<typeof RichTextSchema>;

export const richTextDefaults: RichTextProps = {
  content: "First paragraph.\n\nSecond paragraph with **bold** text.",
  size: "base",
  align: "left",
  color: "text",
};
