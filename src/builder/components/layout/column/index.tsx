import { DropZone } from "@measured/puck";

import { defineComponent } from "@/builder/registry";
import type { BuilderComponentDefinition } from "@/builder/registry";
import { WIDTH_BASIS, columnDefaults } from "./schema";
import type { ColumnProps } from "./schema";
import { columnFields } from "./fields";

export function Column({ width }: ColumnProps) {
  return (
    <div style={{ flex: `1 1 ${WIDTH_BASIS[width]}`, minWidth: 0 }}>
      <DropZone zone="column" />
    </div>
  );
}

export const definition: BuilderComponentDefinition = defineComponent({
  name: "Column",
  label: "Column",
  category: "Layout",
  fields: columnFields,
  defaultProps: columnDefaults,
  render: Column,
});
