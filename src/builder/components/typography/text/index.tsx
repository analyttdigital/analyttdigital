import { defineComponent } from "@/builder/registry";
import type { BuilderComponentDefinition } from "@/builder/registry";
import { alignClass, sizeClass, textColorClass, weightClass } from "../../shared";
import { textDefaults } from "./schema";
import type { TextProps } from "./schema";
import { textFields } from "./fields";

export function Text({ content, size, align, color, weight }: TextProps) {
  return (
    <p className={`font-bldBody ${sizeClass(size)} ${alignClass(align)} ${textColorClass(color)} ${weightClass(weight)}`}>
      {content}
    </p>
  );
}

export const definition: BuilderComponentDefinition = defineComponent({
  name: "Text",
  label: "Text",
  category: "Typography",
  fields: textFields,
  defaultProps: textDefaults,
  render: Text,
});
