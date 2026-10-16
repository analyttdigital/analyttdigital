import type { Fields } from "@measured/puck";

export const textInputFields: Fields = {
  name: { type: "text", label: "Field name" },
  label: { type: "text", label: "Label" },
  placeholder: { type: "text", label: "Placeholder" },
  type: {
    type: "select",
    label: "Type",
    options: [
      { label: "Text", value: "text" },
      { label: "Email", value: "email" },
      { label: "Phone", value: "tel" },
      { label: "URL", value: "url" },
      { label: "Number", value: "number" },
    ],
  },
  required: {
    type: "radio",
    label: "Required",
    options: [
      { label: "No", value: false },
      { label: "Yes", value: true },
    ],
  },
};
