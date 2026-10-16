import type { Fields } from "@measured/puck";

export const quoteFields: Fields = {
  text: { type: "textarea", label: "Quote" },
  author: { type: "text", label: "Author (optional)" },
  color: {
    type: "select",
    label: "Accent",
    options: [
      { label: "Accent", value: "accent" },
      { label: "Primary", value: "primary" },
      { label: "Muted", value: "muted" },
    ],
  },
};
