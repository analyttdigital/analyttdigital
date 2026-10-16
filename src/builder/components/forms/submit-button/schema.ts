import { z } from "zod";

export const SubmitButtonSchema = z.object({
  label: z.string().default("Submit"),
  variant: z.string().default("primary"),
  size: z.enum(["sm", "md", "lg"]).default("md"),
  radius: z.string().default("md"),
  fullWidth: z.boolean().default(false),
});

export type SubmitButtonProps = z.infer<typeof SubmitButtonSchema>;

export const submitButtonDefaults: SubmitButtonProps = {
  label: "Submit",
  variant: "primary",
  size: "md",
  radius: "md",
  fullWidth: false,
};
