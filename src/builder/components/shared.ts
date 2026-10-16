import type { CSSProperties } from "react";

/**
 * Shared helpers for built-in components (M4). Two rules keep every
 * component token-driven:
 *
 * 1. Color props are *token names* (`primary`, `text`, ...) resolved through
 *    the static maps below. The full class names appear literally here, so
 *    Tailwind can never purge them — dynamic `text-bld-${token}` strings
 *    would silently lose their styles in production.
 * 2. Arbitrary user values (padding scale, radius keys) go through CSS
 *    variables in `style` props.
 */

const TEXT_CLASSES: Record<string, string> = {
  primary: "text-bld-primary",
  secondary: "text-bld-secondary",
  accent: "text-bld-accent",
  background: "text-bld-background",
  surface: "text-bld-surface",
  text: "text-bld-text",
  muted: "text-bld-muted",
  border: "text-bld-border",
  success: "text-bld-success",
  warning: "text-bld-warning",
  danger: "text-bld-danger",
};

const BG_CLASSES: Record<string, string> = {
  transparent: "bg-transparent",
  primary: "bg-bld-primary",
  secondary: "bg-bld-secondary",
  accent: "bg-bld-accent",
  background: "bg-bld-background",
  surface: "bg-bld-surface",
  text: "bg-bld-text",
  muted: "bg-bld-muted",
  border: "bg-bld-border",
  success: "bg-bld-success",
  warning: "bg-bld-warning",
  danger: "bg-bld-danger",
};

const BORDER_CLASSES: Record<string, string> = {
  primary: "border-bld-primary",
  secondary: "border-bld-secondary",
  accent: "border-bld-accent",
  background: "border-bld-background",
  surface: "border-bld-surface",
  text: "border-bld-text",
  muted: "border-bld-muted",
  border: "border-bld-border",
  success: "border-bld-success",
  warning: "border-bld-warning",
  danger: "border-bld-danger",
};

export const TEXT_COLOR_OPTIONS = [
  { label: "Text", value: "text" },
  { label: "Muted", value: "muted" },
  { label: "Primary", value: "primary" },
  { label: "Secondary", value: "secondary" },
  { label: "Accent", value: "accent" },
  { label: "Success", value: "success" },
  { label: "Warning", value: "warning" },
  { label: "Danger", value: "danger" },
];

export const SURFACE_COLOR_OPTIONS = [
  { label: "Transparent", value: "transparent" },
  { label: "Background", value: "background" },
  { label: "Surface", value: "surface" },
  { label: "Primary", value: "primary" },
  { label: "Secondary", value: "secondary" },
  { label: "Accent", value: "accent" },
  { label: "Success", value: "success" },
  { label: "Warning", value: "warning" },
  { label: "Danger", value: "danger" },
];

export function textColorClass(token: string): string {
  return TEXT_CLASSES[token] ?? TEXT_CLASSES.text;
}

export function bgClass(token: string): string {
  return BG_CLASSES[token] ?? BG_CLASSES.transparent;
}

export function borderClass(token: string): string {
  return BORDER_CLASSES[token] ?? BORDER_CLASSES.border;
}

/** Radius key (`none`…`full`) to a purging-safe inline style. */
export function radiusStyle(key: string): CSSProperties {
  return { borderRadius: `var(--bld-radius-${key}, 0px)` };
}

/**
 * Spacing scale step (0–8) to a density-aware inline style. One base unit
 * times the theme density scale, so Compact/Spacious retunes every component.
 */
export function spaceVars(steps: number): string {
  return `calc(var(--bld-spacing-base, 4px) * ${steps} * var(--bld-spacing-scale, 1))`;
}

export function padStyle(x?: number, y?: number): CSSProperties {
  return {
    ...(x !== undefined ? { paddingInline: spaceVars(x) } : {}),
    ...(y !== undefined ? { paddingBlock: spaceVars(y) } : {}),
  };
}

export const RADIUS_SELECT_OPTIONS = [
  { label: "None", value: "none" },
  { label: "Small", value: "sm" },
  { label: "Medium", value: "md" },
  { label: "Large", value: "lg" },
  { label: "Full", value: "full" },
];

// Static literals again: every class below must appear verbatim for Tailwind.
const SIZE_CLASSES: Record<string, string> = {
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-5xl",
};

const ALIGN_CLASSES: Record<string, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const WEIGHT_CLASSES: Record<string, string> = {
  regular: "font-normal",
  medium: "font-medium",
  bold: "font-bold",
};

const FONT_ROLE_CLASSES: Record<string, string> = {
  heading: "font-bldHeading",
  body: "font-bldBody",
  mono: "font-bldMono",
};

export const SIZE_OPTIONS = [
  { label: "Small", value: "sm" },
  { label: "Base", value: "base" },
  { label: "Large", value: "lg" },
  { label: "XL", value: "xl" },
  { label: "2XL", value: "2xl" },
  { label: "3XL", value: "3xl" },
  { label: "4XL", value: "4xl" },
  { label: "5XL", value: "5xl" },
];

export const ALIGN_OPTIONS = [
  { label: "Left", value: "left" },
  { label: "Center", value: "center" },
  { label: "Right", value: "right" },
];

export function sizeClass(size: string): string {
  return SIZE_CLASSES[size] ?? SIZE_CLASSES.base;
}

export function alignClass(align: string): string {
  return ALIGN_CLASSES[align] ?? ALIGN_CLASSES.left;
}

export function weightClass(weight: string): string {
  return WEIGHT_CLASSES[weight] ?? WEIGHT_CLASSES.regular;
}

export function fontRoleClass(role: string): string {
  return FONT_ROLE_CLASSES[role] ?? FONT_ROLE_CLASSES.body;
}

// Button variants pair a background, text, and border treatment. Static
// literals for the same purging reason as the color maps.
const BUTTON_VARIANT_CLASSES: Record<string, string> = {
  primary: "bg-bld-primary text-bld-background border border-transparent",
  secondary: "bg-bld-secondary text-bld-background border border-transparent",
  accent: "bg-bld-accent text-bld-background border border-transparent",
  outline: "bg-transparent text-bld-text border border-bld-border",
  ghost: "bg-transparent text-bld-primary border border-transparent",
};

const BUTTON_SIZE_CLASSES: Record<string, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export const BUTTON_VARIANT_OPTIONS = [
  { label: "Primary", value: "primary" },
  { label: "Secondary", value: "secondary" },
  { label: "Accent", value: "accent" },
  { label: "Outline", value: "outline" },
  { label: "Ghost", value: "ghost" },
];

export function buttonVariantClass(variant: string): string {
  return BUTTON_VARIANT_CLASSES[variant] ?? BUTTON_VARIANT_CLASSES.primary;
}

export function buttonSizeClass(size: string): string {
  return BUTTON_SIZE_CLASSES[size] ?? BUTTON_SIZE_CLASSES.md;
}

export function buttonPadding(size: string): string {
  if (size === "sm") return "6px 12px";
  if (size === "lg") return "14px 28px";
  return "10px 20px";
}
