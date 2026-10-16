import type { Fields } from "@measured/puck";

export const selectFields: Fields = {
  name: { type: "text", label: "Field name" },
  label: { type: "text", label: "Label" },
  options: {
    type: "array",
    label: "Options",
    arrayFields: {
      label: { type: "text", label: "Label" },
      value: { type: "text", label: "Value" },
    },
    defaultItemProps: { label: "Option", value: "option" },
    getItemSummary: (item) => String((item as { label?: unknown }).label ?? "Option"),
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
