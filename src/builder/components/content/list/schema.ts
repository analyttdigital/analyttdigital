import { z } from "zod";

export const ListItemSchema = z.object({
  text: z.string().default("List item"),
});

export const ListSchema = z.object({
  items: z.array(ListItemSchema).default([{ text: "First item" }, { text: "Second item" }]),
  variant: z.enum(["bulleted", "numbered", "checks"]).default("bulleted"),
  color: z.string().default("text"),
});

export type ListProps = z.infer<typeof ListSchema>;

export const listDefaults: ListProps = {
  items: [{ text: "First item" }, { text: "Second item" }],
  variant: "bulleted",
  color: "text",
};
