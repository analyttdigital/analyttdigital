import { defineComponent } from "@/builder/registry";
import type { BuilderComponentDefinition } from "@/builder/registry";
import { useEditing } from "@/builder/render/editing";
import { radiusStyle } from "../../shared";
import { videoDefaults } from "./schema";
import type { VideoProps } from "./schema";
import { videoFields } from "./fields";

export function Video({ src, poster, autoplay, muted, loop, controls, radius }: VideoProps) {
  const editing = useEditing();
  if (!src) {
    if (!editing) return null;
    return (
      <div
        className="bg-bld-surface text-bld-muted font-bldBody text-sm"
        style={{ ...radiusStyle(radius), padding: 24, border: "2px dashed currentColor", textAlign: "center" }}
      >
        Video — set a URL in the panel
      </div>
    );
  }
  // Autoplay never fires inside the editor: a playing canvas steals clicks
  // and makes drag and drop unusable.
  const play = autoplay && !editing;
  return (
    <video
      src={src}
      poster={poster || undefined}
      autoPlay={play}
      muted={muted || play}
      loop={loop}
      controls={controls}
      playsInline
      preload="metadata"
      style={{ ...radiusStyle(radius), width: "100%", display: "block" }}
    />
  );
}

export const definition: BuilderComponentDefinition = defineComponent({
  name: "Video",
  label: "Video",
  category: "Media",
  fields: videoFields,
  defaultProps: videoDefaults,
  render: Video,
});
