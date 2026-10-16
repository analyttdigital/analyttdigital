import type { Fields } from "@measured/puck";

import { ColorFieldConfig } from "@/builder/fields";
import { SURFACE_COLOR_OPTIONS } from "../../shared";

export const sectionFields: Fields = {
  background: {
    type: "select",
    label: "Background",
    options: SURFACE_COLOR_OPTIONS,
  },
  customBackground: ColorFieldConfig({
    swatches: [],
    allowCustom: true,
  }),
  padY: {
    type: "number",
    label: "Vertical padding (scale)",
    min: 0,
    max: 8,
  },
};
