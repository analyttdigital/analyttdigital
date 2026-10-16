import { DropZone } from "@measured/puck";

import { defineComponent } from "@/builder/registry";
import type { BuilderComponentDefinition } from "@/builder/registry";
import { bgClass, radiusStyle, spaceVars } from "../../shared";
import { cardDefaults, cardShadow } from "./schema";
import type { CardProps } from "./schema";
import { cardFields } from "./fields";

export function Card({ title, text, background, radius, pad, shadow }: CardProps) {
  return (
    <div
      className={bgClass(background)}
      style={{ ...radiusStyle(radius), padding: spaceVars(pad), boxShadow: cardShadow(shadow) }}
    >
      {title && <h3 className="font-bldHeading text-bld-text text-xl" style={{ marginBottom: 8 }}>{title}</h3>}
      {text && <p className="font-bldBody text-bld-text">{text}</p>}
      <DropZone zone="card" />
    </div>
  );
}

export const definition: BuilderComponentDefinition = defineComponent({
  name: "Card",
  label: "Card",
  category: "Content",
  fields: cardFields,
  defaultProps: cardDefaults,
  render: Card,
});
