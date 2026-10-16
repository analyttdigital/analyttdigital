import { z } from "zod";

export const LinkSchema = z.object({
  label: z.string().default("Learn more"),
  href: z.string().default("#"),
  color: z.string().default("primary"),
  openInNewTab: z.boolean().default(false),
  underline: z.boolean().default(true),
});

export type LinkProps = z.infer<typeof LinkSchema>;

export const linkDefaults: LinkProps = {
  label: "Learn more",
  href: "#",
  color: "primary",
  openInNewTab: false,
  underline: true,
};
