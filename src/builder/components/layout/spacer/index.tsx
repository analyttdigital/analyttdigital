import { defineComponent } from "@/builder/registry";
import type { BuilderComponentDefinition } from "@/builder/registry";
import { spaceVars } from "../../shared";
import { spacerDefaults } from "./schema";
import type { SpacerProps } from "./schema";
import { spacerFields } from "./fields";

export function Spacer({ height }: SpacerProps) {
  return <div aria-hidden="true" style={{ height: spaceVars(height) }} />;
}

export const definition: BuilderComponentDefinition = defineComponent({
  name: "Spacer",
  label: "Spacer",
  category: "Layout",
  fields: spacerFields,
  defaultProps: spacerDefaults,
  render: Spacer,
});
