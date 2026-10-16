import type { Fields } from "@measured/puck";

export const formFields: Fields = {
  action: {
    type: "text",
    label: "Action endpoint (empty = demo mode, shows the success message)",
  },
  method: {
    type: "select",
    label: "Method",
    options: [
      { label: "POST (JSON)", value: "POST" },
      { label: "GET (redirect with query)", value: "GET" },
    ],
  },
  successMessage: { type: "text", label: "Success message" },
};
