import type { Fields } from "@measured/puck";

export const tableFields: Fields = {
  headers: {
    type: "array",
    label: "Columns",
    arrayFields: {
      label: { type: "text", label: "Heading" },
    },
    defaultItemProps: { label: "Column" },
    getItemSummary: (item) => String((item as { label?: unknown }).label ?? "Column"),
  },
  rows: {
    type: "array",
    label: "Rows",
    arrayFields: {
      cells: {
        type: "array",
        label: "Cells",
        arrayFields: {
          value: { type: "text", label: "Value" },
        },
        defaultItemProps: { value: "" },
        getItemSummary: (item) => String((item as { value?: unknown }).value ?? ""),
      },
    },
    defaultItemProps: { cells: [] },
    getItemSummary: (_, index) => `Row ${(index ?? 0) + 1}`,
  },
  striped: {
    type: "radio",
    label: "Striped rows",
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
  },
};
