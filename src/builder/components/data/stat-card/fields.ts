import type { Fields } from "@measured/puck";

export const statCardFields: Fields = {
  value: { type: "text", label: "Value" },
  label: { type: "text", label: "Label" },
  delta: { type: "text", label: "Change (e.g. +12%)" },
  direction: {
    type: "select",
    label: "Direction",
    options: [
      { label: "Up", value: "up" },
      { label: "Down", value: "down" },
      { label: "Flat", value: "flat" },
    ],
  },
};
