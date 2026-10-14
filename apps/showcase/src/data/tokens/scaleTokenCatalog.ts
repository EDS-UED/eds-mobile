import scaleSemanticSpec from '../../../../../packages/tokens/spec/scale/semantic.json';

import { distVarLines } from './distCssManifest';
import type { TokenEntry, TokenGroup } from './tokenCatalogTypes';

export const SCALE_BASE_KEYS = [
  'scale-base',
  'scale-0',
  'scale-025',
  'scale-05',
  'scale-1',
  'scale-1-5',
  'scale-2',
  'scale-3',
  'scale-4',
  'scale-5',
  'scale-5-5',
  'scale-6',
  'scale-7',
  'scale-8',
  'scale-9',
  'scale-10',
  'scale-11',
  'scale-12',
  'scale-13',
  'scale-14',
  'scale-15',
  'scale-16',
  'scale-17',
  'scale-18',
  'scale-19',
  'scale-20',
  'scale-30',
  'scale-40',
  'scale-50',
  'scale-full',
] as const;

function buildScaleEntry(name: string, layer: TokenEntry['layer']): TokenEntry {
  return {
    name,
    layer,
    cssVar: `--${name}`,
    detailLines: distVarLines('scale', name),
  };
}

export function getScaleBaseEntries(): TokenEntry[] {
  return SCALE_BASE_KEYS.map((key) => buildScaleEntry(key, 'base'));
}

export function getScaleSemanticGroups(): TokenGroup[] {
  return scaleSemanticSpec.groups.map((group) => ({
    comment: group.comment,
    tokens: group.tokens.map((token) => buildScaleEntry(token.name, 'semantic')),
  }));
}

export function getScaleTokenByName(name: string): TokenEntry | undefined {
  const base = getScaleBaseEntries().find((entry) => entry.name === name);
  if (base) {
    return base;
  }

  for (const group of getScaleSemanticGroups()) {
    const token = group.tokens.find((entry) => entry.name === name);
    if (token) {
      return token;
    }
  }

  return undefined;
}
