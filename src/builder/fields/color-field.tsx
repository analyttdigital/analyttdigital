import type { CustomField } from "@measured/puck";

import { defaultTheme } from "@/builder/theme/defaults";
import { COLOR_TOKENS } from "@/builder/theme/schema";
import type { ColorToken } from "@/builder/theme/schema";

/**
 * Token-aware color field (M1). Offers the theme palette as swatches plus a
 * custom picker. Values are plain hex strings, so saved props stay portable
 * even if token names change later.
 */

export interface ColorSwatch {
  label: string;
  value: string;
}

const TOKEN_SWATCHES: ColorSwatch[] = COLOR_TOKENS.map((token: ColorToken) => ({
  label: token,
  value: defaultTheme.colors[token].light,
}));

interface ColorFieldOptions {
  swatches?: ColorSwatch[];
  allowCustom?: boolean;
}

export function ColorFieldConfig(options: ColorFieldOptions = {}): CustomField<string> {
  const { swatches = TOKEN_SWATCHES, allowCustom = true } = options;

  return {
    type: "custom",
    render: ({ id, value, onChange, readOnly }) => (
      <div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {swatches.map((swatch) => (
            <button
              key={swatch.label}
              type="button"
              title={`${swatch.label} (${swatch.value})`}
              aria-label={swatch.label}
              aria-pressed={value === swatch.value}
              disabled={readOnly}
              onClick={() => onChange(swatch.value)}
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                backgroundColor: swatch.value,
                border:
                  value === swatch.value ? "2px solid currentColor" : "1px solid rgb(0 0 0 / 0.2)",
                cursor: readOnly ? "default" : "pointer",
              }}
            />
          ))}
        </div>
        {allowCustom && (
          <div style={{ display: "flex", gap: 6, marginTop: 8, alignItems: "center" }}>
            <input
              id={id}
              type="color"
              value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : "#000000"}
              disabled={readOnly}
              onChange={(e) => onChange(e.target.value)}
            />
            <input
              type="text"
              value={value}
              disabled={readOnly}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#rrggbb"
              aria-label="Custom color"
              style={{ flex: 1, minWidth: 0 }}
            />
          </div>
        )}
      </div>
    ),
  };
}
