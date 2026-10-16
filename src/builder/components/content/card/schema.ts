import { z } from "zod";

export const CardSchema = z.object({
  title: z.string().default(""),
  text: z.string().default(""),
  background: z.string().default("surface"),
  radius: z.string().default("md"),
  pad: z.number().min(0).max(8).default(4),
  shadow: z.enum(["none", "sm", "md", "lg"]).default("sm"),
});

export type CardProps = z.infer<typeof CardSchema>;

export const cardDefaults: CardProps = {
  title: "",
  text: "",
  background: "surface",
  radius: "md",
  pad: 4,
  shadow: "sm",
};

// Static literals for Tailwind.
const SHADOW_STYLES: Record<CardProps["shadow"], string> = {
  none: "none",
  sm: "var(--bld-shadow-sm)",
  md: "var(--bld-shadow-md)",
  lg: "var(--bld-shadow-lg)",
};

export function cardShadow(shadow: CardProps["shadow"]): string {
  return SHADOW_STYLES[shadow];
}
