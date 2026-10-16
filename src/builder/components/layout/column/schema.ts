import { z } from "zod";

export const ColumnSchema = z.object({
  width: z.enum(["full", "half", "third", "two-thirds", "quarter", "three-quarters"]).default("full"),
});

export type ColumnProps = z.infer<typeof ColumnSchema>;

export const columnDefaults: ColumnProps = {
  width: "full",
};

export const WIDTH_BASIS: Record<ColumnProps["width"], string> = {
  full: "100%",
  half: "50%",
  third: "33.333%",
  "two-thirds": "66.667%",
  quarter: "25%",
  "three-quarters": "75%",
};
