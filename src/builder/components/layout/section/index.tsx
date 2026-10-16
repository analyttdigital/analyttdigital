import { DropZone } from "@measured/puck";

import { defineComponent } from "@/builder/registry";
import type { BuilderComponentDefinition } from "@/builder/registry";
import { bgClass, spaceVars } from "../../shared";
import { sectionDefaults } from "./schema";
import type { SectionProps } from "./schema";
import { sectionFields } from "./fields";

export function Section({ background, customBackground, padY }: SectionProps) {
  return (
    <section
      className={bgClass(background)}
      style={{
        ...(customBackground ? { backgroundColor: customBackground } : {}),
        paddingBlock: spaceVars(padY),
      }}
    >
      <DropZone zone="section" />
    </section>
  );
}

export const definition: BuilderComponentDefinition = defineComponent({
  name: "Section",
  label: "Section",
  category: "Layout",
  fields: sectionFields,
  defaultProps: sectionDefaults,
  render: Section,
});
