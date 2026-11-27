import mobileTheme from '@eds/mobile-tokens/theme';

import tagPaletteSpec from '../../../../../packages/tokens/spec/color/tag-palette.json';
import huePaletteSpec from '../../../../../packages/tokens/spec/color/palette/hue.json';
import chartPaletteSpec from '../../../../../packages/tokens/spec/color/palette/chart.json';

import { TAG_SEMANTIC_SHOWCASE_GROUPS } from './showcaseTokenGroupComments';
import {
  buildBaseColorFormats,
  buildSemanticColorFormats,
  mapSemanticCssReference,
  parseHexColor,
} from './colorFormats';
import type { ColorTheme, ColorTokenEntry, ColorTokenLayer } from './colorTokenCatalog';

function resolveDisplayP3FromHex(hex: string): [number, number, number] {
  const parsed = parseHexColor(hex);
  if (!parsed) return [0, 0, 0];
  return [parsed.r / 255, parsed.g / 255, parsed.b / 255];
}

function buildPaletteBaseEntry(
  name: string,
  layer: ColorTokenLayer,
  cssVar: string,
  hex: string,
  theme: ColorTheme,
): ColorTokenEntry {
  const resolved =
    layer === 'hue'
      ? mobileTheme.palette?.hue?.[name]?.[theme]
      : mobileTheme.palette?.chart?.[name]?.[theme];
  const value = resolved ?? hex;
  return {
    name,
    layer,
    cssVar,
    value: String(value),
    formats: buildBaseColorFormats(resolveDisplayP3FromHex(hex), hex),
  };
}

export function getHueBaseEntries(theme: ColorTheme = 'light'): ColorTokenEntry[] {
  return Object.entries(huePaletteSpec.hues ?? {}).map(([key, values]) =>
    buildPaletteBaseEntry(key, 'hue', `hue-${key}`, values[theme], theme),
  );
}

export function getChartBaseEntries(theme: ColorTheme = 'light'): ColorTokenEntry[] {
  return Object.entries(chartPaletteSpec.charts ?? {}).map(([key, values]) =>
    buildPaletteBaseEntry(key, 'chart', `chart-${key}`, values[theme], theme),
  );
}

const TAG_GROUP_KEYS = ['mobileColor', 'mobileStatus', 'status', 'colorful', 'custom'] as const;

const TAG_GROUP_ROLES: Record<(typeof TAG_GROUP_KEYS)[number], readonly string[]> = {
  status: ['bg', 'text'],
  colorful: ['bg', 'text'],
  custom: ['bg', 'text', 'bar'],
  mobileColor: ['bg', 'text', 'altBg'],
  mobileStatus: ['bg', 'text'],
};

function parseTagSemanticName(name: string): { groupKey: string; key: string; role: string } | null {
  for (const groupKey of TAG_GROUP_KEYS) {
    const prefix = `tag-${groupKey}-`;
    if (!name.startsWith(prefix)) continue;
    const rest = name.slice(prefix.length);
    const split = rest.lastIndexOf('-');
    if (split <= 0) return null;
    return { groupKey, key: rest.slice(0, split), role: rest.slice(split + 1) };
  }
  return null;
}

function tagSemanticTokenNames(): string[] {
  const names: string[] = [];
  const palette = tagPaletteSpec as unknown as Record<string, Record<string, unknown>>;
  for (const groupKey of TAG_GROUP_KEYS) {
    const roles = TAG_GROUP_ROLES[groupKey];
    for (const key of Object.keys(palette[groupKey] ?? {})) {
      for (const role of roles) {
        names.push(`tag-${groupKey}-${key}-${role}`);
      }
    }
  }
  return names;
}

const TAG_SEMANTIC_TOKEN_NAMES = tagSemanticTokenNames();

function resolveTagSemanticHex(name: string, theme: ColorTheme): string {
  const reference = `color(var(--eds-${name}) / 1)`;
  const parsed = parseTagSemanticName(name);
  if (!parsed) return reference;
  const groups = mobileTheme.tags as Record<
    string,
    Record<string, { light: Record<string, string>; dark: Record<string, string> }>
  >;
  const side = groups[parsed.groupKey]?.[parsed.key]?.[theme]?.[parsed.role];
  return side ?? reference;
}

function buildTagSemanticEntry(name: string, theme: ColorTheme): ColorTokenEntry {
  const reference = `color(var(--eds-${name}) / 1)`;
  const value = resolveTagSemanticHex(name, theme);
  const hex = value.startsWith('#') ? value.slice(0, 7) : value;
  const parsed = value.startsWith('#') ? parseHexColor(hex) : null;
  const p3: [number, number, number] = parsed
    ? [parsed.r / 255, parsed.g / 255, parsed.b / 255]
    : [0, 0, 0];
  return {
    name,
    layer: 'tag',
    cssVar: `--${name}`,
    value: String(value),
    formats: value.startsWith('#')
      ? buildBaseColorFormats(p3, hex)
      : buildSemanticColorFormats(p3, hex, 1),
    cssReference: mapSemanticCssReference(reference),
  };
}

export function getTagSemanticGroups(
  theme: ColorTheme = 'light',
): { comment: string; tokens: ColorTokenEntry[] }[] {
  return TAG_SEMANTIC_SHOWCASE_GROUPS.map(({ comment, prefix }) => ({
    comment,
    tokens: TAG_SEMANTIC_TOKEN_NAMES.filter((name) => name.startsWith(`${prefix}-`)).map((name) =>
      buildTagSemanticEntry(name, theme),
    ),
  })).filter((group) => group.tokens.length > 0);
}

export function getPaletteTokenByName(name: string, theme: ColorTheme = 'light'): ColorTokenEntry | undefined {
  if (name.startsWith('hue-')) {
    const key = name.slice('hue-'.length);
    if (huePaletteSpec.hues?.[key as keyof typeof huePaletteSpec.hues]) {
      const values = huePaletteSpec.hues[key as keyof typeof huePaletteSpec.hues];
      return buildPaletteBaseEntry(key, 'hue', `hue-${key}`, values[theme], theme);
    }
  }
  if (name.startsWith('chart-')) {
    const key = name.slice('chart-'.length);
    if (chartPaletteSpec.charts?.[key as keyof typeof chartPaletteSpec.charts]) {
      const values = chartPaletteSpec.charts[key as keyof typeof chartPaletteSpec.charts];
      return buildPaletteBaseEntry(key, 'chart', `chart-${key}`, values[theme], theme);
    }
  }
  const hueKey = Object.keys(huePaletteSpec.hues ?? {}).find((k) => k === name);
  if (hueKey) {
    const values = huePaletteSpec.hues[hueKey as keyof typeof huePaletteSpec.hues];
    return buildPaletteBaseEntry(hueKey, 'hue', `hue-${hueKey}`, values[theme], theme);
  }
  const chartKey = Object.keys(chartPaletteSpec.charts ?? {}).find((k) => k === name);
  if (chartKey) {
    const values = chartPaletteSpec.charts[chartKey as keyof typeof chartPaletteSpec.charts];
    return buildPaletteBaseEntry(chartKey, 'chart', `chart-${chartKey}`, values[theme], theme);
  }
  if (TAG_SEMANTIC_TOKEN_NAMES.includes(name)) {
    return buildTagSemanticEntry(name, theme);
  }
  return undefined;
}