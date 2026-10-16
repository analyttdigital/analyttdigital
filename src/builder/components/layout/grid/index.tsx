import { DropZone } from "@measured/puck";

import { defineComponent } from "@/builder/registry";
import type { BuilderComponentDefinition } from "@/builder/registry";
import { spaceVars } from "../../shared";
import { gridClasses, gridDefaults } from "./schema";
import type { GridProps } from "./schema";
import { gridFields } from "./fields";

export function Grid({ columns, columnsMobile, gap }: GridProps) {
  return (
    <div className={gridClasses(columns, columnsMobile)} style={{ gap: spaceVars(gap) }}>
      <DropZone zone="grid" />
    </div>
  );
}

export const definition: BuilderComponentDefinition = defineComponent({
  name: "Grid",
  label: "Grid",
  category: "Layout",
  fields: gridFields,
  defaultProps: gridDefaults,
  render: Grid,
});
