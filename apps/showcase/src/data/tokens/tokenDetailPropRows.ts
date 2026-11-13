import type { DocPropRow } from '@/data/components';
import type { TokenEntry } from '@/data/tokens/tokenCatalogTypes';

function lineToPropRow(line: string, index: number, layer: string | undefined): DocPropRow {
  const trimmed = line.trim();
  const match = trimmed.match(/^([^:]+):\s*(.+?);?\s*$/);
  if (!match) {
    return {
      name: `line ${index + 1}`,
      type: 'token',
      defaultValue: trimmed,
      description: layer ?? '',
    };
  }
  return {
    name: match[1].trim(),
    type: 'CSS',
    defaultValue: match[2].trim(),
    description: layer ?? '',
  };
}

export function tokenDetailPropRows(entry: TokenEntry): DocPropRow[] {
  if (entry.detailLines.length > 0) {
    return entry.detailLines.map((line, index) => lineToPropRow(line, index, entry.layer));
  }

  return [
    {
      name: entry.cssVar || entry.name,
      type: entry.layer ?? 'token',
      defaultValue: '—',
      description: entry.name,
    },
  ];
}
