import type { Fields } from "@measured/puck";

export const columnFields: Fields = {
  width: {
    type: "select",
    label: "Width (desktop)",
    options: [
      { label: "Full", value: "full" },
      { label: "1/2", value: "half" },
      { label: "1/3", value: "third" },
      { label: "2/3", value: "two-thirds" },
      { label: "1/4", value: "quarter" },
      { label: "3/4", value: "three-quarters" },
    ],
  },
};
