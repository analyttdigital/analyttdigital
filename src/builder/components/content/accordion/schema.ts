import { z } from "zod";

export const AccordionItemSchema = z.object({
  title: z.string().default("Question"),
  content: z.string().default("Answer."),
});

export const AccordionSchema = z.object({
  items: z.array(AccordionItemSchema).default([
    { title: "First question", content: "First answer." },
    { title: "Second question", content: "Second answer." },
  ]),
  allowMultiple: z.boolean().default(false),
});

export type AccordionProps = z.infer<typeof AccordionSchema>;

export const accordionDefaults: AccordionProps = {
  items: [
    { title: "First question", content: "First answer." },
    { title: "Second question", content: "Second answer." },
  ],
  allowMultiple: false,
};
