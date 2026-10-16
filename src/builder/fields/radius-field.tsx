import type { CustomField } from "@measured/puck";

import { defaultTheme } from "@/builder/theme/defaults";
import { RADIUS_KEYS } from "@/builder/theme/schema";
import type { RadiusKey, Theme } from "@/builder/theme/schema";

/**
 * Radius field (M1). Edits a radius *key* (`sm`, `md`, …), never a raw pixel
 * value, so components keep inheriting from tokens. The preview chip shows
 * the resolved pixel value from the active theme.
 */

interface RadiusFieldOptions {
  theme?: Theme;
}

export function RadiusFieldConfig(options: RadiusFieldOptions = {}): CustomField<string> {
  const { theme = defaultTheme } = options;

  return {
    type: "custom",
    render: ({ value, onChange, readOnly }) => (
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {RADIUS_KEYS.map((key: RadiusKey) => (
          <button
            key={key}
            type="button"
            aria-pressed={value === key}
            disabled={readOnly}
            onClick={() => onChange(key)}
            title={theme.radius[key]}
            style={{
              padding: "4px 10px",
              borderRadius: theme.radius[key],
              border:
                value === key ? "2px solid currentColor" : "1px solid rgb(0 0 0 / 0.25)",
              backgroundColor: "rgb(0 0 0 / 0.05)",
              cursor: readOnly ? "default" : "pointer",
            }}
          >
            {key}
          </button>
        ))}
      </div>
    ),
  };
}
