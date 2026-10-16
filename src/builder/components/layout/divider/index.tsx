import { defineComponent } from "@/builder/registry";
import type { BuilderComponentDefinition } from "@/builder/registry";
import { borderClass, spaceVars } from "../../shared";
import { dividerDefaults } from "./schema";
import type { DividerProps } from "./schema";
import { dividerFields } from "./fields";

export function Divider({ color, thickness, marginY }: DividerProps) {
  return (
    <hr
      className={borderClass(color)}
      style={{
        borderTopWidth: thickness,
        borderTopStyle: "solid",
        marginBlock: spaceVars(marginY),
      }}
    />
  );
}

export const definition: BuilderComponentDefinition = defineComponent({
  name: "Divider",
  label: "Divider",
  category: "Layout",
  fields: dividerFields,
  defaultProps: dividerDefaults,
  render: Divider,
});
