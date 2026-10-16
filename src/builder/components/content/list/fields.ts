import type { Fields } from "@measured/puck";

import { TEXT_COLOR_OPTIONS } from "../../shared";

export const listFields: Fields = {
  items: {
    type: "array",
    label: "Items",
    arrayFields: {
      text: { type: "text", label: "Text" },
    },
    defaultItemProps: { text: "New item" },
    getItemSummary: (item) => String((item as { text?: unknown }).text ?? "Item"),
  },
  variant: {
    type: "select",
    label: "Style",
    options: [
      { label: "Bulleted", value: "bulleted" },
      { label: "Numbered", value: "numbered" },
      { label: "Checks", value: "checks" },
    ],
  },
  color: { type: "select", label: "Color", options: TEXT_COLOR_OPTIONS },
};
