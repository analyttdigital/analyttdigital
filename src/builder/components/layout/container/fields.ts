import type { Fields } from "@measured/puck";

export const containerFields: Fields = {
  maxWidth: {
    type: "select",
    label: "Max width",
    options: [
      { label: "Small (640px)", value: "sm" },
      { label: "Medium (768px)", value: "md" },
      { label: "Large (1024px)", value: "lg" },
      { label: "Extra large (1280px)", value: "xl" },
      { label: "Full", value: "full" },
    ],
  },
  padX: {
    type: "number",
    label: "Horizontal padding (scale)",
    min: 0,
    max: 8,
  },
};
