import { DropZone } from "@measured/puck";

import { defineComponent } from "@/builder/registry";
import type { BuilderComponentDefinition } from "@/builder/registry";
import { spaceVars } from "../../shared";
import { MAX_WIDTH_PX, containerDefaults } from "./schema";
import type { ContainerProps } from "./schema";
import { containerFields } from "./fields";

export function Container({ maxWidth, padX }: ContainerProps) {
  return (
    <div
      style={{
        maxWidth: MAX_WIDTH_PX[maxWidth],
        marginInline: "auto",
        paddingInline: spaceVars(padX),
      }}
    >
      <DropZone zone="container" />
    </div>
  );
}

export const definition: BuilderComponentDefinition = defineComponent({
  name: "Container",
  label: "Container",
  category: "Layout",
  fields: containerFields,
  defaultProps: containerDefaults,
  render: Container,
});
