import { z } from "zod";

export const ContainerSchema = z.object({
  maxWidth: z.enum(["sm", "md", "lg", "xl", "full"]).default("lg"),
  padX: z.number().min(0).max(8).default(4),
});

export type ContainerProps = z.infer<typeof ContainerSchema>;

export const containerDefaults: ContainerProps = {
  maxWidth: "lg",
  padX: 4,
};

export const MAX_WIDTH_PX: Record<ContainerProps["maxWidth"], string> = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  full: "100%",
};
