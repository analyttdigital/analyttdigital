import { z } from "zod";

export const HeadingSchema = z.object({
  text: z.string().default("Heading"),
  level: z.enum(["h1", "h2", "h3", "h4"]).default("h2"),
  size: z.string().default("3xl"),
  align: z.enum(["left", "center", "right"]).default("left"),
  color: z.string().default("text"),
  font: z.enum(["heading", "body", "mono"]).default("heading"),
});

export type HeadingProps = z.infer<typeof HeadingSchema>;

export const headingDefaults: HeadingProps = {
  text: "Heading",
  level: "h2",
  size: "3xl",
  align: "left",
  color: "text",
  font: "heading",
};
