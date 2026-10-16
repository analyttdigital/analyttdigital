import { z } from "zod";

export const GridSchema = z.object({
  columns: z.number().min(1).max(4).default(2),
  columnsMobile: z.number().min(1).max(2).default(1),
  gap: z.number().min(0).max(8).default(4),
});

export type GridProps = z.infer<typeof GridSchema>;

export const gridDefaults: GridProps = {
  columns: 2,
  columnsMobile: 1,
  gap: 4,
};

// Static class literals only: dynamic `grid-cols-${n}` would be purged.
const MOBILE_COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
};
const DESKTOP_COLS: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};

export function gridClasses(columns: number, columnsMobile: number): string {
  return `grid ${MOBILE_COLS[columnsMobile] ?? "grid-cols-1"} ${DESKTOP_COLS[columns] ?? "md:grid-cols-2"}`;
}
