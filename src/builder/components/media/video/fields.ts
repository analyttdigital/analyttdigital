import type { Fields, RadioField } from "@measured/puck";

import { RadiusFieldConfig } from "@/builder/fields";
import { MediaUrlField } from "@/builder/fields/upload-field";

const yesNo = (label: string): RadioField => ({
  type: "radio",
  label,
  options: [
    { label: "No", value: false },
    { label: "Yes", value: true },
  ],
});

export const videoFields: Fields = {
  src: MediaUrlField({ accept: "video/*" }),
  poster: { type: "text", label: "Poster image URL (optional)" },
  autoplay: yesNo("Autoplay (muted, public page only)"),
  muted: yesNo("Muted"),
  loop: yesNo("Loop"),
  controls: yesNo("Controls"),
  radius: RadiusFieldConfig(),
};
