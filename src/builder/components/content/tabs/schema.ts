import { z } from "zod";

export const TabSchema = z.object({
  label: z.string().default("Tab"),
  content: z.string().default("Tab content."),
});

export const TabsSchema = z.object({
  tabs: z.array(TabSchema).default([
    { label: "First", content: "First tab content." },
    { label: "Second", content: "Second tab content." },
  ]),
});

export type TabsProps = z.infer<typeof TabsSchema>;

export const tabsDefaults: TabsProps = {
  tabs: [
    { label: "First", content: "First tab content." },
    { label: "Second", content: "Second tab content." },
  ],
};
