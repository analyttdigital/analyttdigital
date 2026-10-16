import type { Fields } from "@measured/puck";

import { ALIGN_OPTIONS, SIZE_OPTIONS, TEXT_COLOR_OPTIONS } from "../../shared";

export const richTextFields: Fields = {
  content: { type: "textarea", label: "Content (blank line = new paragraph, **bold**)" },
  size: { type: "select", label: "Size", options: SIZE_OPTIONS },
  align: { type: "select", label: "Align", options: ALIGN_OPTIONS },
  color: { type: "select", label: "Color", options: TEXT_COLOR_OPTIONS },
};
