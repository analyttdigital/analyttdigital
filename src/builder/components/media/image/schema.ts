import { z } from "zod";

export const ImageSchema = z.object({
  src: z.string().default(""),
  alt: z.string().default(""),
  caption: z.string().default(""),
  radius: z.string().default("md"),
  fullWidth: z.boolean().default(true),
});

export type ImageProps = z.infer<typeof ImageSchema>;

export const imageDefaults: ImageProps = {
  src: "",
  alt: "",
  caption: "",
  radius: "md",
  fullWidth: true,
};
