import { defineComponent } from "@/builder/registry";
import type { BuilderComponentDefinition } from "@/builder/registry";
import { useEditing } from "@/builder/render/editing";
import { radiusStyle } from "../../shared";
import { imageDefaults } from "./schema";
import type { ImageProps } from "./schema";
import { imageFields } from "./fields";

export function Image({ src, alt, caption, radius, fullWidth }: ImageProps) {
  const editing = useEditing();
  if (!src) {
    if (!editing) return null;
    return (
      <div
        className="bg-bld-surface text-bld-muted font-bldBody text-sm"
        style={{ ...radiusStyle(radius), padding: 24, border: "2px dashed currentColor", textAlign: "center" }}
      >
        Image — set a URL in the panel
      </div>
    );
  }
  return (
    <figure style={{ margin: 0 }}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="font-bldBody"
        style={{ ...radiusStyle(radius), width: fullWidth ? "100%" : undefined, display: "block" }}
      />
      {caption && <figcaption className="text-bld-muted text-sm" style={{ marginTop: 8 }}>{caption}</figcaption>}
    </figure>
  );
}

export const definition: BuilderComponentDefinition = defineComponent({
  name: "Image",
  label: "Image",
  category: "Media",
  fields: imageFields,
  defaultProps: imageDefaults,
  render: Image,
});
