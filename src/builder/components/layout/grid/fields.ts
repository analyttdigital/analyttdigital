import type { Fields } from "@measured/puck";

export const gridFields: Fields = {
  columns: {
    type: "number",
    label: "Columns (desktop)",
    min: 1,
    max: 4,
  },
  columnsMobile: {
    type: "number",
    label: "Columns (mobile)",
    min: 1,
    max: 2,
  },
  gap: {
    type: "number",
    label: "Gap (scale)",
    min: 0,
    max: 8,
  },
};
