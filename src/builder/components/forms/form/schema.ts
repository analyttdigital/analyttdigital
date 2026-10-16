import { z } from "zod";

export const FormSchema = z.object({
  action: z.string().default(""),
  method: z.enum(["POST", "GET"]).default("POST"),
  successMessage: z.string().default("Thanks — we got it."),
});

export type FormProps = z.infer<typeof FormSchema>;

export const formDefaults: FormProps = {
  action: "",
  method: "POST",
  successMessage: "Thanks — we got it.",
};
