import MdiIcon from "@mdi/react";

import { defineComponent } from "@/builder/registry";
import type { BuilderComponentDefinition } from "@/builder/registry";
import { textColorClass } from "../../shared";
import { iconDefaults, iconPath } from "./schema";
import type { IconProps } from "./schema";
import { iconFields } from "./fields";

export function Icon({ icon, size, color }: IconProps) {
  return (
    <span
      role="img"
      aria-label={icon}
      className={textColorClass(color)}
      style={{ display: "inline-flex", lineHeight: 0 }}
    >
      <MdiIcon path={iconPath(icon)} size={`${size / 24}`} />
    </span>
  );
}

export const definition: BuilderComponentDefinition = defineComponent({
  name: "Icon",
  label: "Icon",
  category: "Media",
  fields: iconFields,
  defaultProps: iconDefaults,
  render: Icon,
});
