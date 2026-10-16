import { z } from "zod";

export const TextInputSchema = z.object({
  name: z.string().min(1).default("email"),
  label: z.string().default("Email"),
  placeholder: z.string().default(""),
  type: z.enum(["text", "email", "tel", "url", "number"]).default("text"),
  required: z.boolean().default(false),
});

export type TextInputProps = z.infer<typeof TextInputSchema>;

export const textInputDefaults: TextInputProps = {
  name: "email",
  label: "Email",
  placeholder: "",
  type: "text",
  required: false,
};
