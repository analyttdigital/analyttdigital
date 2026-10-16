import { z } from "zod";

export const SelectOptionSchema = z.object({
  label: z.string().default("Option"),
  value: z.string().default("option"),
});

export const SelectSchema = z.object({
  name: z.string().min(1).default("choice"),
  label: z.string().default("Choice"),
  options: z.array(SelectOptionSchema).default([
    { label: "First", value: "first" },
    { label: "Second", value: "second" },
  ]),
  required: z.boolean().default(false),
});

export type SelectProps = z.infer<typeof SelectSchema>;

export const selectDefaults: SelectProps = {
  name: "choice",
  label: "Choice",
  options: [
    { label: "First", value: "first" },
    { label: "Second", value: "second" },
  ],
  required: false,
};
