import { z } from "zod";

export const TableHeaderSchema = z.object({
  label: z.string().default("Column"),
});

export const TableCellSchema = z.object({
  value: z.string().default(""),
});

export const TableRowSchema = z.object({
  cells: z.array(TableCellSchema).default([]),
});

export const TableSchema = z.object({
  headers: z.array(TableHeaderSchema).default([{ label: "Name" }, { label: "Value" }]),
  rows: z
    .array(TableRowSchema)
    .default([{ cells: [{ value: "Alpha" }, { value: "1" }] }]),
  striped: z.boolean().default(true),
});

export type TableProps = z.infer<typeof TableSchema>;

export const tableDefaults: TableProps = {
  headers: [{ label: "Name" }, { label: "Value" }],
  rows: [{ cells: [{ value: "Alpha" }, { value: "1" }] }],
  striped: true,
};
