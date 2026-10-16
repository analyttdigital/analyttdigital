import { useState } from "react";
import { mdiBullhorn } from "@mdi/js";
import MdiIcon from "@mdi/react";
import { z } from "zod";

import { registerComponent } from "@/builder/registry";
import type { RegisterComponentOptions } from "@/builder/registry";
import { borderClass, radiusStyle } from "@/builder/components/shared";

/**
 * Example custom component (M5). One file + one `registerComponent` call is
 * the whole integration: the editor form derives from `CalloutSchema`, saved
 * props validate with fallback to defaults, and `editing` arrives as a prop.
 * Dismiss state is local (per view, not persisted) and disabled in the canvas
 * so authors always see the content while editing.
 */

export const CalloutSchema = z.object({
  title: z.string().describe("Title").default("Heads up"),
  message: z.string().describe("Message").default("This is a custom registered component."),
  variant: z.enum(["info", "success", "warning"]).describe("Variant").default("info"),
  radius: z.string().describe("Corner radius").default("md"),
});

export type CalloutProps = z.infer<typeof CalloutSchema>;

const VARIANT_TOKENS = {
  info: "primary",
  success: "success",
  warning: "warning",
} as const;

export function Callout({
  title,
  message,
  variant,
  radius,
  editing,
}: CalloutProps & { editing?: boolean }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed && !editing) return null;
  return (
    <div
      role="note"
      className={`bg-bld-surface font-bldBody ${borderClass(VARIANT_TOKENS[variant])}`}
      style={{
        ...radiusStyle(radius),
        borderLeftWidth: 4,
        borderLeftStyle: "solid",
        padding: 16,
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
      }}
    >
      <MdiIcon path={mdiBullhorn} size={1} />
      <div style={{ flex: 1 }}>
        <p className="text-bld-text" style={{ fontWeight: 600, margin: "0 0 4px" }}>{title}</p>
        <p className="text-bld-text" style={{ margin: 0 }}>{message}</p>
      </div>
      <button
        type="button"
        aria-label="Dismiss"
        disabled={editing}
        onClick={() => setDismissed(true)}
        style={{ background: "none", border: "none", cursor: editing ? "default" : "pointer" }}
        className="text-bld-muted"
      >
        ✕
      </button>
    </div>
  );
}

export const calloutOptions: RegisterComponentOptions<CalloutProps> = {
  name: "Callout",
  label: "Callout",
  category: "Custom",
  icon: mdiBullhorn,
  schema: CalloutSchema,
  defaultProps: {
    title: "Heads up",
    message: "This is a custom registered component.",
    variant: "info",
    radius: "md",
  },
  render: Callout,
};

export function registerCallout(): void {
  registerComponent(calloutOptions);
}

registerCallout();
