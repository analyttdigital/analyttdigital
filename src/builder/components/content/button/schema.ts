import { z } from "zod";

export const ButtonSchema = z.object({
  label: z.string().default("Click me"),
  href: z.string().default("#"),
  variant: z.string().default("primary"),
  size: z.enum(["sm", "md", "lg"]).default("md"),
  radius: z.string().default("md"),
  fullWidth: z.boolean().default(false),
  openInNewTab: z.boolean().default(false),
});

export type ButtonProps = z.infer<typeof ButtonSchema>;

export const buttonDefaults: ButtonProps = {
  label: "Click me",
  href: "#",
  variant: "primary",
  size: "md",
  radius: "md",
  fullWidth: false,
  openInNewTab: false,
};
