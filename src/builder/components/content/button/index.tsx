import { defineComponent } from "@/builder/registry";
import type { BuilderComponentDefinition } from "@/builder/registry";
import { buttonPadding, buttonSizeClass, buttonVariantClass, radiusStyle } from "../../shared";
import { buttonDefaults } from "./schema";
import type { ButtonProps } from "./schema";
import { buttonFields } from "./fields";

export function Button({ label, href, variant, size, radius, fullWidth, openInNewTab }: ButtonProps) {
  return (
    <a
      href={href}
      target={openInNewTab ? "_blank" : undefined}
      rel={openInNewTab ? "noreferrer" : undefined}
      className={`font-bldBody font-medium inline-block text-center ${buttonVariantClass(variant)} ${buttonSizeClass(size)}`}
      style={{
        ...radiusStyle(radius),
        padding: buttonPadding(size),
        width: fullWidth ? "100%" : undefined,
      }}
    >
      {label}
    </a>
  );
}

export const definition: BuilderComponentDefinition = defineComponent({
  name: "Button",
  label: "Button",
  category: "Actions",
  fields: buttonFields,
  defaultProps: buttonDefaults,
  render: Button,
});
