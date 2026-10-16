import type { Fields } from "@measured/puck";

import { ALIGN_OPTIONS, SIZE_OPTIONS, TEXT_COLOR_OPTIONS } from "../../shared";

export const headingFields: Fields = {
  text: { type: "text", label: "Text" },
  level: {
    type: "select",
    label: "Level",
    options: [
      { label: "H1", value: "h1" },
      { label: "H2", value: "h2" },
      { label: "H3", value: "h3" },
      { label: "H4", value: "h4" },
    ],
  },
  size: { type: "select", label: "Size", options: SIZE_OPTIONS },
  align: { type: "select", label: "Align", options: ALIGN_OPTIONS },
  color: { type: "select", label: "Color", options: TEXT_COLOR_OPTIONS },
  font: {
    type: "select",
    label: "Font",
    options: [
      { label: "Heading", value: "heading" },
      { label: "Body", value: "body" },
      { label: "Mono", value: "mono" },
    ],
  },
};
