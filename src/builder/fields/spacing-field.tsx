import type { CustomField } from "@measured/puck";

import { SPACING_DENSITIES } from "@/builder/theme/schema";
import type { SpacingDensity } from "@/builder/theme/schema";

/**
 * Spacing field (M1). Edits the theme's spacing *density* — a semantic choice
 * (`compact`/`comfortable`/`spacious`) that scales the base unit via
 * `--bld-spacing-scale`, rather than scattering pixel values across props.
 */
export function SpacingFieldConfig(): CustomField<string> {
  return {
    type: "custom",
    render: ({ value, onChange, readOnly }) => (
      <div style={{ display: "flex", gap: 6 }} role="radiogroup" aria-label="Spacing density">
        {SPACING_DENSITIES.map((density: SpacingDensity) => (
          <button
            key={density}
            type="button"
            role="radio"
            aria-checked={value === density}
            disabled={readOnly}
            onClick={() => onChange(density)}
            style={{
              flex: 1,
              padding: "4px 6px",
              border: value === density ? "2px solid currentColor" : "1px solid rgb(0 0 0 / 0.25)",
              borderRadius: 6,
              cursor: readOnly ? "default" : "pointer",
            }}
          >
            {density}
          </button>
        ))}
      </div>
    ),
  };
}
