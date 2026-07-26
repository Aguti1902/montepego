export type OverrideRecord = {
  field: string;
  value: unknown;
};

/**
 * Aplica overrides manuales sobre un objeto propiedad.
 * El último override por campo gana.
 */
export function applyOverrides<T extends Record<string, unknown>>(
  base: T,
  overrides: OverrideRecord[],
): T {
  const result: Record<string, unknown> = { ...base };
  const latestByField = new Map<string, unknown>();

  for (const override of overrides) {
    latestByField.set(override.field, override.value);
  }

  for (const [field, value] of latestByField) {
    result[field] = value;
  }

  return result as T;
}
