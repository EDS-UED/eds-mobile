import { Platform } from 'react-native';

import { formatColorSemanticListReference, formatColorSemanticOpacityPercent } from './colorFormats';
import { distResolveValue, distVarValue } from './distCssManifest';
import type { TokenEntry, TokenGroup } from './tokenCatalogTypes';

/** Catalog list row — literal value, or `--ref / resolved` when value references another var. */
export function tokenListValueLabel(
  categoryId: string,
  entry: Pick<TokenEntry, 'name' | 'detailLines'>,
): string | undefined {
  const raw =
    entry.detailLines[0]?.replace(/;\s*$/, '').trim() ?? distVarValue(categoryId, entry.name)?.trim();

  if (!raw) {
    return undefined;
  }

  const varRefs = [...raw.matchAll(/var\((--[a-z0-9-]+)\)/g)].map((match) => match[1]);

  if (varRefs.length === 0) {
    return raw;
  }

  const reference = varRefs[0];
  const resolved = distResolveValue(raw);

  return `${reference} / ${resolved}`;
}

type TokenListColorEntry = {
  layer?: TokenEntry['layer'];
  cssReference?: string;
  formats?: { rgb: string };
  value?: string;
};

function scaleListRaw(entry: Pick<TokenEntry, 'name'> & { detailLines?: string[] }) {
  return (
    entry.detailLines?.[0]?.replace(/;\s*$/, '').trim() ??
    distVarValue('scale', entry.name)?.trim()
  );
}

function formatScaleNativeMeasure(resolved: string): string {
  const trimmed = resolved.trim();
  const pxMatch = /^(-?[\d.]+)px$/.exec(trimmed);
  if (pxMatch) {
    const unit = Platform.OS === 'ios' ? 'pt' : 'dp';
    return `${pxMatch[1]} ${unit}`;
  }

  return trimmed;
}

/** Scale base → resolved px only; semantic → `var(--scale-x) / Npx` (literals as-is). */
export function tokenScaleListValueLabel(entry: TokenListRowValueEntry): string | undefined {
  const raw = scaleListRaw(entry);
  if (!raw) {
    return undefined;
  }

  const resolved = distResolveValue(raw);

  if (Platform.OS !== 'web') {
    return formatScaleNativeMeasure(resolved);
  }

  if (entry.layer === 'base') {
    return resolved;
  }

  const varRef = /^var\((--[a-z0-9-]+)\)$/.exec(raw);
  if (varRef) {
    return `var(${varRef[1]}) / ${resolved}`;
  }

  return raw;
}

/** Color semantic list — Web: CSS ref；Native: opacity `NN%` only. */
export function tokenColorListValueLabel(entry: TokenListColorEntry): string | undefined {
  const reference = entry.cssReference?.trim();

  if (Platform.OS !== 'web' && entry.layer === 'semantic') {
    const opacity = formatColorSemanticOpacityPercent(reference);
    if (opacity) {
      return opacity;
    }
  }

  if (!reference) {
    return entry.formats?.rgb ?? entry.value;
  }

  return formatColorSemanticListReference(reference) ?? entry.formats?.rgb ?? entry.value;
}

export type TokenListRowValueEntry = Pick<TokenEntry, 'name' | 'cssVar'> &
  Partial<Pick<TokenEntry, 'layer' | 'detailLines'>> &
  TokenListColorEntry;

export function resolveTokenListValueLabel(
  categoryId: string,
  entry: TokenListRowValueEntry,
): string | undefined {
  if (categoryId === 'color' && entry.layer === 'semantic') {
    return tokenColorListValueLabel(entry);
  }

  if (categoryId === 'scale') {
    return tokenScaleListValueLabel(entry);
  }

  if (categoryId === 'effect') {
    return undefined;
  }

  if (entry.cssVar.startsWith('--')) {
    return tokenListValueLabel(categoryId, {
      name: entry.name,
      detailLines: entry.detailLines ?? [],
    });
  }

  return undefined;
}

/** Dist CSS value line — trailing semicolon. */
export function cssValueLine(value: string) {
  const trimmed = value.trim();
  return trimmed.endsWith(';') ? trimmed : `${trimmed};`;
}

export function buildVarReferenceLine(varName: string) {
  const normalized = varName.startsWith('--') ? varName : `--${varName}`;
  return cssValueLine(`var(${normalized})`);
}

export function buildLiteralLine(value: string) {
  return cssValueLine(value);
}

export function normalizeStyleProperties(properties: Record<string, string | undefined>) {
  return Object.fromEntries(
    Object.entries(properties).filter((entry): entry is [string, string] => entry[1] !== undefined),
  );
}

export function stylePropertyLines(properties: Record<string, string | undefined>) {
  return Object.entries(normalizeStyleProperties(properties)).map(([key, value]) =>
    cssValueLine(`${key}: ${value}`),
  );
}

export function flattenStyleGroups<
  T extends {
    comment: string;
    styles: Array<{ className: string; properties: Record<string, string | undefined> }>;
  },
>(groups: T[], layer: TokenEntry['layer'] = 'semantic'): TokenGroup[] {
  return groups.map((group) => ({
    comment: group.comment,
    tokens: group.styles.map((style) => ({
      name: style.className,
      layer,
      cssVar: `.${style.className}`,
      detailLines: stylePropertyLines(style.properties),
    })),
  }));
}
