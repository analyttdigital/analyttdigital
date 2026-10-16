import { defineComponent } from "@/builder/registry";
import type { BuilderComponentDefinition } from "@/builder/registry";
import { buttonPadding, buttonSizeClass, buttonVariantClass, radiusStyle } from "../../shared";
import { submitButtonDefaults } from "./schema";
import type { SubmitButtonProps } from "./schema";
import { submitButtonFields } from "./fields";

export function SubmitButton({ label, variant, size, radius, fullWidth }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className={`font-bldBody font-medium ${buttonVariantClass(variant)} ${buttonSizeClass(size)}`}
      style={{
        ...radiusStyle(radius),
        padding: buttonPadding(size),
        width: fullWidth ? "100%" : undefined,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

export const definition: BuilderComponentDefinition = defineComponent({
  name: "SubmitButton",
  label: "Submit button",
  category: "Forms",
  fields: submitButtonFields,
  defaultProps: submitButtonDefaults,
  render: SubmitButton,
});
