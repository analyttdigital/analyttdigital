import { getComponent, registerComponent } from "@/builder/registry";
import type { BuilderComponentDefinition } from "@/builder/registry";

import { definition as Section } from "./layout/section";
import { definition as Container } from "./layout/container";
import { definition as Row } from "./layout/row";
import { definition as Column } from "./layout/column";
import { definition as Grid } from "./layout/grid";
import { definition as Spacer } from "./layout/spacer";
import { definition as Divider } from "./layout/divider";
import { definition as Heading } from "./typography/heading";
import { definition as Text } from "./typography/text";
import { definition as RichText } from "./typography/rich-text";
import { definition as Quote } from "./typography/quote";
import { definition as Button } from "./content/button";
import { definition as Link } from "./content/link";
import { definition as Image } from "./media/image";
import { definition as Video } from "./media/video";
import { definition as Icon } from "./media/icon";
import { definition as List } from "./content/list";
import { definition as Table } from "./content/table";
import { definition as Card } from "./content/card";
import { definition as Accordion } from "./content/accordion";
import { definition as Tabs } from "./content/tabs";
import { definition as Form } from "./forms/form";
import { definition as TextInput } from "./forms/text-input";
import { definition as Textarea } from "./forms/textarea";
import { definition as Select } from "./forms/select";
import { definition as Checkbox } from "./forms/checkbox";
import { definition as SubmitButton } from "./forms/submit-button";
import { definition as StatCard } from "./data/stat-card";
import { definition as ChartPlaceholder } from "./data/chart-placeholder";

/**
 * Built-in component inventory (M4). Every entry flows through
 * `registerComponent` — never hard wired into the config — so the palette
 * is exactly this list plus M5 custom registrations.
 */
export const builtInComponents: BuilderComponentDefinition[] = [
  Section,
  Container,
  Row,
  Column,
  Grid,
  Spacer,
  Divider,
  Heading,
  Text,
  RichText,
  Quote,
  Button,
  Link,
  Image,
  Video,
  Icon,
  List,
  Table,
  Card,
  Accordion,
  Tabs,
  Form,
  TextInput,
  Textarea,
  Select,
  Checkbox,
  SubmitButton,
  StatCard,
  ChartPlaceholder,
];

export const BUILT_IN_COUNT = builtInComponents.length;

/**
 * Idempotent: safe to call from `buildConfig()` on every render.
 * Presence-based (not a module flag) so `clearRegistryForTests` stays honest.
 */
export function ensureBuiltInsRegistered(): void {
  if (getComponent("Section")) return;
  for (const def of builtInComponents) {
    registerComponent(def);
  }
}
