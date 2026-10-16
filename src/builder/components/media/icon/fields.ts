import type { Fields } from "@measured/puck";

import { TEXT_COLOR_OPTIONS } from "../../shared";
import { ICON_OPTIONS } from "./schema";

export const iconFields: Fields = {
  icon: { type: "select", label: "Icon", options: ICON_OPTIONS },
  size: { type: "number", label: "Size (px)", min: 12, max: 96 },
  color: { type: "select", label: "Color", options: TEXT_COLOR_OPTIONS },
};
