import { z } from "zod";

export const QuoteSchema = z.object({
  text: z.string().default("A memorable quote."),
  author: z.string().default(""),
  color: z.string().default("accent"),
});

export type QuoteProps = z.infer<typeof QuoteSchema>;

export const quoteDefaults: QuoteProps = {
  text: "A memorable quote.",
  author: "",
  color: "accent",
};
