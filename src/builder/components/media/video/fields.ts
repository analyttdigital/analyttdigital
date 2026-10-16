import type { Fields, RadioField } from "@measured/puck";

import { RadiusFieldConfig } from "@/builder/fields";

const yesNo = (label: string): RadioField => ({
  type: "radio",
  label,
  options: [
    { label: "No", value: false },
    { label: "Yes", value: true },
  ],
});

export const videoFields: Fields = {
  src: { type: "text", label: "Video URL" },
  poster: { type: "text", label: "Poster image URL (optional)" },
  autoplay: yesNo("Autoplay (muted, public page only)"),
  muted: yesNo("Muted"),
  loop: yesNo("Loop"),
  controls: yesNo("Controls"),
  radius: RadiusFieldConfig(),
};
