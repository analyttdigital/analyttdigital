import { z } from "zod";

export const SectionSchema = z.object({
  background: z.string().default("transparent"),
  customBackground: z.string().default(""),
  padY: z.number().min(0).max(8).default(4),
});

export type SectionProps = z.infer<typeof SectionSchema>;

export const sectionDefaults: SectionProps = {
  background: "transparent",
  customBackground: "",
  padY: 4,
};
