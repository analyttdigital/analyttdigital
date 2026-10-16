import type { Fields } from "@measured/puck";

export const dividerFields: Fields = {
  color: {
    type: "select",
    label: "Color",
    options: [
      { label: "Border", value: "border" },
      { label: "Muted", value: "muted" },
      { label: "Primary", value: "primary" },
      { label: "Accent", value: "accent" },
    ],
  },
  thickness: {
    type: "number",
    label: "Thickness (px)",
    min: 1,
    max: 4,
  },
  marginY: {
    type: "number",
    label: "Vertical margin (scale)",
    min: 0,
    max: 8,
  },
};
