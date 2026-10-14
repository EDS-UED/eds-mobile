import { distSourceRef } from './distCssManifest';
import type { TokenEntry } from './tokenCatalogTypes';

/** Detail code fence — selector + declarations, no `{}`, left-aligned lines. */
export function normalizeDetailSnippet(snippet: string): string {
  const normalized: string[] = [];

  for (const line of snippet.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed === '{' || trimmed === '}') {
      continue;
    }

    const selectorOnly = trimmed.match(/^(\.[a-z0-9-]+)\s*\{?\s*$/);
    if (selectorOnly) {
      normalized.push(selectorOnly[1]);
      continue;
    }

    const selectorWithBody = trimmed.match(/^(\.[a-z0-9-]+)\s*\{\s*(.+)$/);
    if (selectorWithBody) {
      normalized.push(selectorWithBody[1]);
      const body = selectorWithBody[2].replace(/\}\s*$/, '').trim();
      if (body) {
        normalized.push(body);
      }
      continue;
    }

    normalized.push(trimmed.replace(/\}\s*$/, '').trim());
  }

  return normalized.join('\n');
}

export function resolveTokenDetailSnippet(categoryId: string, entry: TokenEntry): string | undefined {
  const sourceRef = distSourceRef(categoryId, entry.name);
  if (sourceRef?.snippet) {
    return normalizeDetailSnippet(sourceRef.snippet);
  }

  if (entry.cssVar.startsWith('.')) {
    if (entry.detailLines.length === 0) {
      return undefined;
    }

    return normalizeDetailSnippet([entry.cssVar, ...entry.detailLines].join('\n'));
  }

  if (entry.cssVar.startsWith('--')) {
    const valueLine = entry.detailLines[0];
    if (!valueLine) {
      return undefined;
    }

    const value = valueLine.endsWith(';') ? valueLine.slice(0, -1) : valueLine;
    return normalizeDetailSnippet(`${entry.cssVar}: ${value};`);
  }

  return undefined;
}
