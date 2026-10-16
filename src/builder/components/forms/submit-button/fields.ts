import type { Fields } from "@measured/puck";

import { RadiusFieldConfig } from "@/builder/fields";
import { BUTTON_VARIANT_OPTIONS } from "../../shared";

export const submitButtonFields: Fields = {
  label: { type: "text", label: "Label" },
  variant: { type: "select", label: "Variant", options: BUTTON_VARIANT_OPTIONS },
  size: {
    type: "select",
    label: "Size",
    options: [
      { label: "Small", value: "sm" },
      { label: "Medium", value: "md" },
      { label: "Large", value: "lg" },
    ],
  },
  radius: RadiusFieldConfig(),
  fullWidth: {
    type: "radio",
    label: "Full width",
    options: [
      { label: "No", value: false },
      { label: "Yes", value: true },
    ],
  },
};
