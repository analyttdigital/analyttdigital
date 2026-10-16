import type { Fields } from "@measured/puck";

export const textareaFields: Fields = {
  name: { type: "text", label: "Field name" },
  label: { type: "text", label: "Label" },
  placeholder: { type: "text", label: "Placeholder" },
  rows: { type: "number", label: "Rows", min: 2, max: 12 },
  required: {
    type: "radio",
    label: "Required",
    options: [
      { label: "No", value: false },
      { label: "Yes", value: true },
    ],
  },
};
