import type { Fields } from "@measured/puck";

export const rowFields: Fields = {
  gap: {
    type: "number",
    label: "Gap (scale)",
    min: 0,
    max: 8,
  },
  align: {
    type: "select",
    label: "Vertical alignment",
    options: [
      { label: "Top", value: "start" },
      { label: "Center", value: "center" },
      { label: "Bottom", value: "end" },
      { label: "Stretch", value: "stretch" },
    ],
  },
  stackOnMobile: {
    type: "radio",
    label: "Stack on mobile",
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
  },
};
