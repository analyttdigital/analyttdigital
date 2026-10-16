import { DropZone } from "@measured/puck";

import { defineComponent } from "@/builder/registry";
import type { BuilderComponentDefinition } from "@/builder/registry";
import { spaceVars } from "../../shared";
import { rowDefaults } from "./schema";
import type { RowProps } from "./schema";
import { rowFields } from "./fields";

const ALIGN_ITEMS: Record<RowProps["align"], string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
};

export function Row({ gap, align, stackOnMobile }: RowProps) {
  return (
    <div
      className={stackOnMobile ? "flex flex-col md:flex-row" : "flex flex-row"}
      style={{ gap: spaceVars(gap), alignItems: ALIGN_ITEMS[align] }}
    >
      <DropZone zone="row" />
    </div>
  );
}

export const definition: BuilderComponentDefinition = defineComponent({
  name: "Row",
  label: "Row",
  category: "Layout",
  fields: rowFields,
  defaultProps: rowDefaults,
  render: Row,
});
