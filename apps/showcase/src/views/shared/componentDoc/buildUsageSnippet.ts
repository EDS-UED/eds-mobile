function camelToKebab(key: string): string {
  return key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function escapeAttr(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

export function buildVueSelfClosingSnippet(
  tag: string,
  props: Record<string, unknown>,
  options?: {
    vModel?: string;
    defaults?: Record<string, unknown>;
    omitKeys?: string[];
  },
): string {
  const defaults = options?.defaults ?? {};
  const omit = new Set(options?.omitKeys ?? []);
  const parts: string[] = [];

  if (options?.vModel) {
    parts.push(`v-model="${options.vModel}"`);
  }

  for (const [key, raw] of Object.entries(props)) {
    if (omit.has(key)) continue;
    if (raw === undefined || raw === null) continue;
    const defaultValue = defaults[key];
    if (raw === defaultValue) continue;

    const kebab = camelToKebab(key);

    if (typeof raw === 'boolean') {
      if (raw) parts.push(kebab);
      continue;
    }

    if (typeof raw === 'string') {
      if (raw === '') continue;
      parts.push(`${kebab}="${escapeAttr(raw)}"`);
      continue;
    }

    parts.push(`:${kebab}="${raw}"`);
  }

  if (parts.length === 0) {
    return `<${tag} />`;
  }

  return `<${tag}\n  ${parts.join('\n  ')}\n/>`;
}

/** Opening tag only (for default-slot or nested markup snippets). */
export function buildVueOpeningTag(
  tag: string,
  props: Record<string, unknown>,
  options?: {
    vModel?: string;
    defaults?: Record<string, unknown>;
    omitKeys?: string[];
  },
): string {
  const selfClosing = buildVueSelfClosingSnippet(tag, props, options);
  if (selfClosing.endsWith('/>')) {
    return `${selfClosing.slice(0, -2).trimEnd()}>`;
  }
  return selfClosing;
}

export function buildVueDefaultSlotSnippet(
  tag: string,
  props: Record<string, unknown>,
  slotText: string,
  options?: {
    vModel?: string;
    defaults?: Record<string, unknown>;
    omitKeys?: string[];
  },
): string {
  const open = buildVueOpeningTag(tag, props, options);
  return `${open}\n  ${slotText}\n</${tag}>`;
}

export function buildComponentAiPrompt(options: {
  componentTag: string;
  importCode: string;
  usageSnippet: string;
}): string {
  return [
    'Use the EDS Desktop Vue 3 component below in the target app.',
    '',
    'Package: @/stubs/eds-components',
    `Component: ${options.componentTag}`,
    '',
    'Import:',
    options.importCode,
    '',
    'Usage (from showcase — implement as-is):',
    options.usageSnippet,
    '',
    'Notes:',
    '- Template attributes in the snippet use kebab-case; keep them as written.',
    '- Styling comes from the component and @eds/mobile-tokens; use the library rather than ad-hoc colors.',
    '- For API beyond the snippet, refer to EDS Desktop component source or docs.',
  ].join('\n');
}
