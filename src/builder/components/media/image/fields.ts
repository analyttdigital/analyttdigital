import type { Fields } from "@measured/puck";

import { RadiusFieldConfig } from "@/builder/fields";

export const imageFields: Fields = {
  src: { type: "text", label: "Image URL" },
  alt: { type: "text", label: "Alt text (required for accessibility)" },
  caption: { type: "text", label: "Caption (optional)" },
  radius: RadiusFieldConfig(),
  fullWidth: {
    type: "radio",
    label: "Full width",
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
  },
};
