import type { CustomField } from "@measured/puck";

import { CURATED_FONTS } from "@/builder/theme/fonts";

/**
 * Font field (M1). Selects from the curated `next/font` list only — the theme
 * stores a font *name* and `fontStack()` resolves it to the loaded variable,
 * so unpublished families can never be referenced. Custom upload is a later
 * milestone.
 */
export function FontFieldConfig(): CustomField<string> {
  return {
    type: "custom",
    render: ({ id, value, onChange, readOnly }) => (
      <select
        id={id}
        value={value}
        disabled={readOnly}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%" }}
      >
        {CURATED_FONTS.map((font) => (
          <option key={font.name} value={font.name} style={{ fontFamily: font.stack }}>
            {font.name}
          </option>
        ))}
      </select>
    ),
  };
}
