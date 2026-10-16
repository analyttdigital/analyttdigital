import type { Fields } from "@measured/puck";

export const chartPlaceholderFields: Fields = {
  title: { type: "text", label: "Title" },
  bars: {
    type: "array",
    label: "Bars",
    arrayFields: {
      value: { type: "number", label: "Value (0–100)", min: 0, max: 100 },
      label: { type: "text", label: "Label" },
    },
    defaultItemProps: { value: 50, label: "" },
    getItemSummary: (item) => {
      const bar = item as { label?: unknown; value?: unknown };
      return `${String(bar.label ?? "")} (${String(bar.value ?? "")})`;
    },
  },
  color: {
    type: "select",
    label: "Bar color",
    options: [
      { label: "Primary", value: "primary" },
      { label: "Accent", value: "accent" },
      { label: "Success", value: "success" },
    ],
  },
};
