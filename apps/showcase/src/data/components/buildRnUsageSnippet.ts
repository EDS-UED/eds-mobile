function camelToKebab(key: string): string {
  return key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function escapeJsx(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

/** RN/JSX usage snippet for the code tab — mirrors Desktop Vue snippet shape. */
export function buildRnSelfClosingSnippet(
  tag: string,
  props: Record<string, unknown>,
  options?: {
    defaults?: Record<string, unknown>;
    omitKeys?: string[];
  },
): string {
  const defaults = options?.defaults ?? {};
  const omit = new Set(options?.omitKeys ?? []);
  const parts: string[] = [];

  for (const [key, raw] of Object.entries(props)) {
    if (omit.has(key)) continue;
    if (raw === undefined || raw === null) continue;
    if (raw === defaults[key]) continue;

    const prop = key === 'className' ? 'className' : key;

    if (typeof raw === 'boolean') {
      parts.push(raw ? `${prop}` : `${prop}={false}`);
      continue;
    }

    if (typeof raw === 'string') {
      if (raw === '') continue;
      parts.push(`${prop}="${escapeJsx(raw)}"`);
      continue;
    }

    parts.push(`${prop}={${JSON.stringify(raw)}}`);
  }

  if (parts.length === 0) {
    return `<${tag} />`;
  }

  return `<${tag}\n  ${parts.join('\n  ')}\n/>`;
}
