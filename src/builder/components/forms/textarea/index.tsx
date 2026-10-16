import { defineComponent } from "@/builder/registry";
import type { BuilderComponentDefinition } from "@/builder/registry";
import { textareaDefaults } from "./schema";
import type { TextareaProps } from "./schema";
import { textareaFields } from "./fields";

export function Textarea({ name, label, placeholder, rows, required }: TextareaProps) {
  return (
    <label className="font-bldBody text-bld-text text-sm" style={{ display: "block", marginBottom: 12 }}>
      <span style={{ display: "block", marginBottom: 4 }}>{label}</span>
      <textarea
        name={name}
        placeholder={placeholder || undefined}
        rows={rows}
        required={required}
        className="bg-bld-background text-bld-text border-bld-border"
        style={{ width: "100%", padding: "8px 12px", borderWidth: 1, borderRadius: "var(--bld-radius-sm)" }}
      />
    </label>
  );
}

export const definition: BuilderComponentDefinition = defineComponent({
  name: "Textarea",
  label: "Textarea",
  category: "Forms",
  fields: textareaFields,
  defaultProps: textareaDefaults,
  render: Textarea,
});
