import type { Fields } from "@measured/puck";

export const tabsFields: Fields = {
  tabs: {
    type: "array",
    label: "Tabs",
    arrayFields: {
      label: { type: "text", label: "Label" },
      content: { type: "textarea", label: "Content" },
    },
    defaultItemProps: { label: "New tab", content: "New tab content." },
    getItemSummary: (item) => String((item as { label?: unknown }).label ?? "Tab"),
  },
};
