import typographyBaseSpec from '../../../../../packages/tokens/spec/typography/base.json';
import typographySemanticSpec from '../../../../../packages/tokens/spec/typography/semantic.json';
import textStylesSpec from '../../../../../packages/tokens/spec/text/styles.json';

import { distClassDetailLines, distVarLines } from './distCssManifest';
import type { TokenEntry, TokenGroup } from './tokenCatalogTypes';
import { cssValueLine } from './tokenCatalogUtils';

function isTypographyFamilyGroup(group: { tokens: Record<string, unknown> }) {
  return Object.keys(group.tokens).some((name) => name.startsWith('eds-family-'));
}

function buildBaseVarEntry(name: string): TokenEntry {
  return {
    name,
    layer: 'base',
    cssVar: `--${name}`,
    detailLines: distVarLines('typography', name),
  };
}

type TypographyBaseGroup = (typeof typographyBaseSpec.groups)[number];

function flattenBaseGroups(filter?: (group: TypographyBaseGroup) => boolean): TokenGroup[] {
  return typographyBaseSpec.groups
    .filter((group) => (filter ? filter(group) : true))
    .map((group) => ({
      comment: group.comment,
      tokens: Object.keys(group.tokens).map((name) => buildBaseVarEntry(name)),
    }));
}

export function getTypographyTextStyleGroups(): TokenGroup[] {
  return [
    {
      comment: 'Text Styles',
      tokens: textStylesSpec.styles.map((style) => ({
        name: style.className,
        layer: 'semantic',
        cssVar: `.${style.className}`,
        detailLines: distClassDetailLines('typography', style.className),
      })),
    },
  ];
}

export function getTypographyFamilyGroups(): TokenGroup[] {
  return flattenBaseGroups(isTypographyFamilyGroup);
}

export function getTypographyPrimitiveBaseGroups(): TokenGroup[] {
  return flattenBaseGroups((group) => !isTypographyFamilyGroup(group));
}

/** @deprecated Use segment-specific getters — kept for token resolution. */
export function getTypographyBaseGroups(): TokenGroup[] {
  return flattenBaseGroups();
}

export function getTypographyBaseEntries(): TokenEntry[] {
  return getTypographyBaseGroups().flatMap((group) => group.tokens);
}

function buildRoleSemanticGroups(): TokenGroup[] {
  return typographySemanticSpec.groups.map((group) => ({
    comment: group.comment,
    tokens: group.tokens.map((token) => ({
      name: token.name,
      layer: 'semantic' as const,
      cssVar: `--${token.name}`,
      detailLines: distVarLines('typography', token.name).length
        ? distVarLines('typography', token.name)
        : [cssValueLine(token.value)],
    })),
  }));
}

/** @deprecated Use getTypographyTextStyleGroups — role tokens are internal wiring. */
export function getTypographySemanticGroups(): TokenGroup[] {
  return [...buildRoleSemanticGroups(), ...getTypographyTextStyleGroups()];
}

export function getTypographyTokenByName(name: string): TokenEntry | undefined {
  const pools = [
    getTypographyTextStyleGroups(),
    getTypographyFamilyGroups(),
    getTypographyPrimitiveBaseGroups(),
    buildRoleSemanticGroups(),
  ];

  for (const groups of pools) {
    for (const group of groups) {
      const token = group.tokens.find((entry) => entry.name === name);
      if (token) {
        return token;
      }
    }
  }

  return undefined;
}
