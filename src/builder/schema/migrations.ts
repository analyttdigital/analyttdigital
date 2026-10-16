/**
 * Content migrations (M2). Every page/shared doc carries `schemaVersion`.
 * When the shape changes, add a `migrate<N>To<M>` step and chain it here.
 * Currently only version 1 exists, so migration is the identity function.
 */
export function migrateDoc<T>(doc: T): T {
  return doc;
}
