export { registerComponent, getComponent, listComponents, clearRegistryForTests } from "./registry";
export { defineComponent } from "./types";
export type {
  BuilderComponentDefinition,
  RegisteredComponentConfig,
  RegisterComponentOptions,
} from "./types";
export { schemaToFields } from "./derive";
export { validateProps } from "./validate";
