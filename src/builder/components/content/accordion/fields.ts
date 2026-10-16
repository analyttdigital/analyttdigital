import type { Fields } from "@measured/puck";

export const accordionFields: Fields = {
  items: {
    type: "array",
    label: "Items",
    arrayFields: {
      title: { type: "text", label: "Title" },
      content: { type: "textarea", label: "Content" },
    },
    defaultItemProps: { title: "New question", content: "New answer." },
    getItemSummary: (item) => String((item as { title?: unknown }).title ?? "Item"),
  },
  allowMultiple: {
    type: "radio",
    label: "Allow multiple open",
    options: [
      { label: "No", value: false },
      { label: "Yes", value: true },
    ],
  },
};
