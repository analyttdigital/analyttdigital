import type { Fields } from "@measured/puck";

import { RadiusFieldConfig } from "@/builder/fields";
import { SURFACE_COLOR_OPTIONS } from "../../shared";

export const cardFields: Fields = {
  title: { type: "text", label: "Title (optional)" },
  text: { type: "textarea", label: "Text (optional)" },
  background: { type: "select", label: "Background", options: SURFACE_COLOR_OPTIONS },
  radius: RadiusFieldConfig(),
  pad: { type: "number", label: "Padding (scale)", min: 0, max: 8 },
  shadow: {
    type: "select",
    label: "Shadow",
    options: [
      { label: "None", value: "none" },
      { label: "Small", value: "sm" },
      { label: "Medium", value: "md" },
      { label: "Large", value: "lg" },
    ],
  },
};
