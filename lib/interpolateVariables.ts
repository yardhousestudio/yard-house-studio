export type Variables = Record<string, string>;

const TOKEN = /\$\{([A-Z0-9_]+)\}/g;

function interpolateString(value: string, variables: Variables): string {
  return value.replace(TOKEN, (_, key: string) =>
    Object.prototype.hasOwnProperty.call(variables, key) ? variables[key] : `\${${key}}`,
  );
}

// Walks any JSON-shaped value, replacing `${KEY}` tokens in strings.
// Pure — does not mutate the input.
export function interpolateVariables<T>(value: T, variables: Variables): T {
  if (typeof value === "string") {
    return interpolateString(value, variables) as T;
  }
  if (Array.isArray(value)) {
    return value.map((v) => interpolateVariables(v, variables)) as T;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = interpolateVariables(v, variables);
    }
    return out as T;
  }
  return value;
}

export function variablesFromRows(
  rows: Array<{ key: string; value: string }>,
): Variables {
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}
