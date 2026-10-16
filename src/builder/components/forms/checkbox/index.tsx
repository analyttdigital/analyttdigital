import { defineComponent } from "@/builder/registry";
import type { BuilderComponentDefinition } from "@/builder/registry";
import { checkboxDefaults } from "./schema";
import type { CheckboxProps } from "./schema";
import { checkboxFields } from "./fields";

export function Checkbox({ name, label, checked, required }: CheckboxProps) {
  return (
    <label
      className="font-bldBody text-bld-text text-sm"
      style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}
    >
      <input type="checkbox" name={name} defaultChecked={checked} required={required} />
      <span>{label}</span>
    </label>
  );
}

export const definition: BuilderComponentDefinition = defineComponent({
  name: "Checkbox",
  label: "Checkbox",
  category: "Forms",
  fields: checkboxFields,
  defaultProps: checkboxDefaults,
  render: Checkbox,
});
