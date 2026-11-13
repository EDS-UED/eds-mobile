import mobileTheme from '@eds/mobile-tokens/theme';

import colorBaseSpec from '../../../../../packages/tokens/spec/color/base.json';
import colorSemanticSpec from '../../../../../packages/tokens/spec/color/semantic.json';

import {
  buildBaseColorFormats,
  buildSemanticColorFormats,
  mapSemanticCssReference,
  parseHexColor,
  type ColorFormats,
} from './colorFormats';

/** Primitives@Cregis — same order as packages/tokens spec / dist base.css. */
export const COLOR_BASE_KEYS = [
  'brand',
  'match',
  'decor',
  'success',
  'danger',
  'warning',
  'base',
  'face',
  'same-black',
  'same-white',
  'page',
  'flotation',
] as const;

import { COLOR_SEMANTIC_SHOWCASE_GROUPS } from './showcaseTokenGroupComments';

export const COLOR_SEMANTIC_GROUPS = COLOR_SEMANTIC_SHOWCASE_GROUPS;

/** Semantic token names — 1:1 with dist color semantic.css (light + dark). */
export const COLOR_SEMANTIC_TOKEN_NAMES = colorSemanticSpec.tokens.map((token) => token.name);

export type ColorTheme = 'light' | 'dark';
export type ColorTokenLayer = 'base' | 'semantic';

export type ColorTokenEntry = {
  name: string;
  layer: ColorTokenLayer;
  cssVar: string;
  value: string;
  formats: ColorFormats;
  /** Semantic only — dist CSS reference (var / color-mix). */
  cssReference?: string;
};

type ColorBaseEntry = { hex: string; displayP3?: [number, number, number] };

function resolveBaseDisplayP3(entry: ColorBaseEntry): [number, number, number] {
  if (entry.displayP3?.length === 3) {
    return entry.displayP3;
  }
  const parsed = parseHexColor(entry.hex);
  if (parsed) {
    return [parsed.r / 255, parsed.g / 255, parsed.b / 255];
  }
  return [0, 0, 0];
}

export function resolveColorTheme(scheme: string | null | undefined): ColorTheme {
  return scheme === 'dark' ? 'dark' : 'light';
}

function getThemeColors(theme: ColorTheme) {
  return mobileTheme.colors[theme];
}

function getBaseSpec(theme: ColorTheme): Record<string, ColorBaseEntry> {
  return colorBaseSpec[theme] as unknown as Record<string, ColorBaseEntry>;
}

function parseSemanticReference(value: string) {
  const match = value.match(/^color\(var\((--eds-[a-z-]+)\)\s*\/\s*([0-9.]+)\)$/);
  if (!match) {
    return null;
  }

  // `--eds-base` → `eds-base` (matches base.json keys)
  return { edsKey: match[1].slice(2), alpha: Number(match[2]) };
}

function semanticSpecByName(name: string) {
  return colorSemanticSpec.tokens.find((token) => token.name === name);
}

function buildBaseEntry(key: (typeof COLOR_BASE_KEYS)[number], theme: ColorTheme): ColorTokenEntry {
  const baseSpec = getBaseSpec(theme);
  const colors = getThemeColors(theme);
  const specEntry = baseSpec[`eds-${key}`];

  return {
    name: key,
    layer: 'base',
    cssVar: `eds-${key}`,
    value: String(colors[key]),
    formats: buildBaseColorFormats(resolveBaseDisplayP3(specEntry), specEntry.hex),
  };
}

function buildSemanticEntry(name: string, theme: ColorTheme): ColorTokenEntry {
  const token = semanticSpecByName(name);
  const specValue = token?.[theme];
  const reference = specValue ? parseSemanticReference(specValue) : null;
  const colors = getThemeColors(theme);
  const resolved = String(colors[name as keyof typeof colors]);
  const cssReference = specValue ? mapSemanticCssReference(specValue) : undefined;
  const baseSpec = getBaseSpec(theme);

  if (!reference) {
    const fallbackHex = resolved.startsWith('#') ? resolved.slice(0, 7) : resolved;
    const fallbackBase = Object.values(baseSpec)[0];

    return {
      name,
      layer: 'semantic',
      cssVar: `--${name}`,
      value: resolved,
      cssReference,
      formats: buildBaseColorFormats(resolveBaseDisplayP3(fallbackBase), fallbackHex),
    };
  }

  const baseEntry = baseSpec[reference.edsKey];
  if (!baseEntry) {
    const parsed = parseHexColor(resolved);
    const fallbackHex = resolved.startsWith('#') ? resolved.slice(0, 7) : resolved;
    const fallbackP3: [number, number, number] = parsed
      ? [parsed.r / 255, parsed.g / 255, parsed.b / 255]
      : [0, 0, 0];

    return {
      name,
      layer: 'semantic',
      cssVar: `--${name}`,
      value: resolved,
      cssReference,
      formats: buildSemanticColorFormats(fallbackP3, fallbackHex, reference.alpha),
    };
  }

  return {
    name,
    layer: 'semantic',
    cssVar: `--${name}`,
    value: resolved,
    cssReference,
    formats: buildSemanticColorFormats(
      resolveBaseDisplayP3(baseEntry),
      baseEntry.hex,
      reference.alpha,
    ),
  };
}

export function getColorBaseEntries(theme: ColorTheme = 'light'): ColorTokenEntry[] {
  return COLOR_BASE_KEYS.map((key) => buildBaseEntry(key, theme));
}

export function getColorSemanticGroups(
  theme: ColorTheme = 'light',
): { comment: string; tokens: ColorTokenEntry[] }[] {
  return COLOR_SEMANTIC_GROUPS.map(({ comment, prefix }) => ({
    comment,
    tokens: colorSemanticSpec.tokens
      .filter((token) => token.name.startsWith(`${prefix}-`))
      .map((token) => buildSemanticEntry(token.name, theme)),
  })).filter((group) => group.tokens.length > 0);
}

export function getColorTokenByName(name: string, theme: ColorTheme = 'light'): ColorTokenEntry | undefined {
  const base = getColorBaseEntries(theme).find((entry) => entry.name === name);
  if (base) {
    return base;
  }

  if (!COLOR_SEMANTIC_TOKEN_NAMES.includes(name)) {
    return undefined;
  }

  return buildSemanticEntry(name, theme);
}
