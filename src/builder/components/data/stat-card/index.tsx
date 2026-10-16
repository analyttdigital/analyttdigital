import { defineComponent } from "@/builder/registry";
import type { BuilderComponentDefinition } from "@/builder/registry";
import { radiusStyle } from "../../shared";
import { statCardDefaults } from "./schema";
import type { StatCardProps } from "./schema";
import { statCardFields } from "./fields";

const DIRECTION_CLASSES: Record<StatCardProps["direction"], string> = {
  up: "text-bld-success",
  down: "text-bld-danger",
  flat: "text-bld-muted",
};

const DIRECTION_ARROWS: Record<StatCardProps["direction"], string> = {
  up: "▲",
  down: "▼",
  flat: "●",
};

export function StatCard({ value, label, delta, direction }: StatCardProps) {
  return (
    <div
      className="bg-bld-surface font-bldBody"
      style={{ ...radiusStyle("md"), padding: 20, boxShadow: "var(--bld-shadow-sm)" }}
    >
      <p className="text-bld-muted text-sm" style={{ margin: 0 }}>{label}</p>
      <p className="font-bldHeading text-bld-text" style={{ fontSize: 32, margin: "4px 0" }}>{value}</p>
      <p className={DIRECTION_CLASSES[direction]} style={{ margin: 0, fontSize: 13 }}>
        <span aria-hidden="true">{DIRECTION_ARROWS[direction]} </span>
        {delta}
      </p>
    </div>
  );
}

export const definition: BuilderComponentDefinition = defineComponent({
  name: "StatCard",
  label: "Stat card",
  category: "Dashboard",
  fields: statCardFields,
  defaultProps: statCardDefaults,
  render: StatCard,
});
