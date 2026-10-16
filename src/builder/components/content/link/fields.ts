import type { Fields } from "@measured/puck";

import { TEXT_COLOR_OPTIONS } from "../../shared";

export const linkFields: Fields = {
  label: { type: "text", label: "Label" },
  href: { type: "text", label: "Link URL" },
  color: { type: "select", label: "Color", options: TEXT_COLOR_OPTIONS },
  openInNewTab: {
    type: "radio",
    label: "Open in new tab",
    options: [
      { label: "No", value: false },
      { label: "Yes", value: true },
    ],
  },
  underline: {
    type: "radio",
    label: "Underline",
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
  },
};
