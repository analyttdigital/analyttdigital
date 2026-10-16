import { defineComponent } from "@/builder/registry";
import type { BuilderComponentDefinition } from "@/builder/registry";
import { textInputDefaults } from "./schema";
import type { TextInputProps } from "./schema";
import { textInputFields } from "./fields";

export function TextInput({ name, label, placeholder, type, required }: TextInputProps) {
  return (
    <label className="font-bldBody text-bld-text text-sm" style={{ display: "block", marginBottom: 12 }}>
      <span style={{ display: "block", marginBottom: 4 }}>{label}</span>
      <input
        type={type}
        name={name}
        placeholder={placeholder || undefined}
        required={required}
        className="bg-bld-background text-bld-text border-bld-border"
        style={{ width: "100%", padding: "8px 12px", borderWidth: 1, borderRadius: "var(--bld-radius-sm)" }}
      />
    </label>
  );
}

export const definition: BuilderComponentDefinition = defineComponent({
  name: "TextInput",
  label: "Text input",
  category: "Forms",
  fields: textInputFields,
  defaultProps: textInputDefaults,
  render: TextInput,
});
