import type { Fields } from "@measured/puck";

const yesNo = (label: string) => ({
  type: "radio" as const,
  label,
  options: [
    { label: "No", value: false },
    { label: "Yes", value: true },
  ],
});

export const checkboxFields: Fields = {
  name: { type: "text", label: "Field name" },
  label: { type: "text", label: "Label" },
  checked: yesNo("Checked by default"),
  required: yesNo("Required"),
};
