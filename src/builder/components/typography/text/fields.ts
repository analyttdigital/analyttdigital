import type { Fields } from "@measured/puck";

import { ALIGN_OPTIONS, SIZE_OPTIONS, TEXT_COLOR_OPTIONS } from "../../shared";

export const textFields: Fields = {
  content: { type: "textarea", label: "Content" },
  size: { type: "select", label: "Size", options: SIZE_OPTIONS },
  align: { type: "select", label: "Align", options: ALIGN_OPTIONS },
  color: { type: "select", label: "Color", options: TEXT_COLOR_OPTIONS },
  weight: {
    type: "select",
    label: "Weight",
    options: [
      { label: "Regular", value: "regular" },
      { label: "Medium", value: "medium" },
      { label: "Bold", value: "bold" },
    ],
  },
};
