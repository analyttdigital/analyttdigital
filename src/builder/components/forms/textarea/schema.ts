import { z } from "zod";

export const TextareaSchema = z.object({
  name: z.string().min(1).default("message"),
  label: z.string().default("Message"),
  placeholder: z.string().default(""),
  rows: z.number().min(2).max(12).default(4),
  required: z.boolean().default(false),
});

export type TextareaProps = z.infer<typeof TextareaSchema>;

export const textareaDefaults: TextareaProps = {
  name: "message",
  label: "Message",
  placeholder: "",
  rows: 4,
  required: false,
};
