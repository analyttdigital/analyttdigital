import type { Fields } from "@measured/puck";

import { RadiusFieldConfig } from "@/builder/fields";
import { MediaUrlField } from "@/builder/fields/upload-field";

export const imageFields: Fields = {
  src: MediaUrlField({ accept: "image/*" }),
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
