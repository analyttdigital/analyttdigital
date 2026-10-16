import { createElement } from "react";

import { defineComponent } from "@/builder/registry";
import type { BuilderComponentDefinition } from "@/builder/registry";
import { alignClass, fontRoleClass, sizeClass, textColorClass } from "../../shared";
import { headingDefaults } from "./schema";
import type { HeadingProps } from "./schema";
import { headingFields } from "./fields";

export function Heading({ text, level, size, align, color, font }: HeadingProps) {
  return createElement(
    level,
    {
      className: `${sizeClass(size)} ${alignClass(align)} ${textColorClass(color)} ${fontRoleClass(font)}`,
    },
    text,
  );
}

export const definition: BuilderComponentDefinition = defineComponent({
  name: "Heading",
  label: "Heading",
  category: "Typography",
  fields: headingFields,
  defaultProps: headingDefaults,
  render: Heading,
});
