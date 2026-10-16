import { z } from "zod";

export const CheckboxSchema = z.object({
  name: z.string().min(1).default("consent"),
  label: z.string().default("I agree"),
  checked: z.boolean().default(false),
  required: z.boolean().default(false),
});

export type CheckboxProps = z.infer<typeof CheckboxSchema>;

export const checkboxDefaults: CheckboxProps = {
  name: "consent",
  label: "I agree",
  checked: false,
  required: false,
};
