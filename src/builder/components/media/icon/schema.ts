import {
  mdiArrowLeft,
  mdiArrowRight,
  mdiCart,
  mdiCheck,
  mdiChevronDown,
  mdiClock,
  mdiClose,
  mdiDownload,
  mdiEmail,
  mdiHeart,
  mdiMagnify,
  mdiMapMarker,
  mdiMenu,
  mdiMinus,
  mdiOpenInNew,
  mdiPause,
  mdiPhone,
  mdiPlay,
  mdiPlus,
  mdiStar,
} from "@mdi/js";
import { z } from "zod";

export const ICON_PATHS: Record<string, string> = {
  menu: mdiMenu,
  close: mdiClose,
  check: mdiCheck,
  "arrow-right": mdiArrowRight,
  "arrow-left": mdiArrowLeft,
  "chevron-down": mdiChevronDown,
  star: mdiStar,
  heart: mdiHeart,
  cart: mdiCart,
  phone: mdiPhone,
  email: mdiEmail,
  "map-marker": mdiMapMarker,
  clock: mdiClock,
  search: mdiMagnify,
  plus: mdiPlus,
  minus: mdiMinus,
  download: mdiDownload,
  "open-in-new": mdiOpenInNew,
  play: mdiPlay,
  pause: mdiPause,
};

export const ICON_OPTIONS = Object.keys(ICON_PATHS).map((name) => ({ label: name, value: name }));

export const IconSchema = z.object({
  icon: z.string().default("star"),
  size: z.number().min(12).max(96).default(24),
  color: z.string().default("text"),
});

export type IconProps = z.infer<typeof IconSchema>;

export const iconDefaults: IconProps = {
  icon: "star",
  size: 24,
  color: "text",
};

export function iconPath(name: string): string {
  return ICON_PATHS[name] ?? ICON_PATHS.star;
}
