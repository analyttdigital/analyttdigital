import { z } from "zod";

export const VideoSchema = z.object({
  src: z.string().default(""),
  poster: z.string().default(""),
  autoplay: z.boolean().default(false),
  muted: z.boolean().default(true),
  loop: z.boolean().default(false),
  controls: z.boolean().default(true),
  radius: z.string().default("md"),
});

export type VideoProps = z.infer<typeof VideoSchema>;

export const videoDefaults: VideoProps = {
  src: "",
  poster: "",
  autoplay: false,
  muted: true,
  loop: false,
  controls: true,
  radius: "md",
};
