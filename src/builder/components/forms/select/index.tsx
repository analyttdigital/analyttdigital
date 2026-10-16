import { defineComponent } from "@/builder/registry";
import type { BuilderComponentDefinition } from "@/builder/registry";
import { selectDefaults } from "./schema";
import type { SelectProps } from "./schema";
import { selectFields } from "./fields";

export function Select({ name, label, options, required }: SelectProps) {
  return (
    <label className="font-bldBody text-bld-text text-sm" style={{ display: "block", marginBottom: 12 }}>
      <span style={{ display: "block", marginBottom: 4 }}>{label}</span>
      <select
        name={name}
        required={required}
        className="bg-bld-background text-bld-text border-bld-border"
        style={{ width: "100%", padding: "8px 12px", borderWidth: 1, borderRadius: "var(--bld-radius-sm)" }}
      >
        {options.map((opt, i) => (
          <option key={i} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export const definition: BuilderComponentDefinition = defineComponent({
  name: "Select",
  label: "Select",
  category: "Forms",
  fields: selectFields,
  defaultProps: selectDefaults,
  render: Select,
});
