import effectBaseSpec from '../../../../../packages/tokens/spec/effect/base.json';
import effectSemanticCatalog from './generated/effectSemanticCatalog.json';

import { distClassDetailLines, distVarLines } from './distCssManifest';
import type { TokenEntry, TokenGroup } from './tokenCatalogTypes';

type EffectBaseToken =
  | { name: string; title?: string; value: string }
  | { name: string; title?: string; layers: string[] };

function buildEffectBaseEntry(token: EffectBaseToken): TokenEntry {
  const distLines = distVarLines('effect', token.name);
  return {
    name: token.name,
    layer: 'base',
    cssVar: `--${token.name}`,
    detailLines:
      distLines.length > 0
        ? distLines
        : [
            ('layers' in token ? token.layers.join(', ') : token.value).endsWith(';')
              ? ('layers' in token ? token.layers.join(', ') : token.value)
              : `${'layers' in token ? token.layers.join(', ') : token.value};`,
          ],
  };
}

export function getEffectBaseGroups(): TokenGroup[] {
  return effectBaseSpec.groups.map((group) => ({
    comment: group.comment,
    tokens: group.tokens.map((token) => buildEffectBaseEntry(token as EffectBaseToken)),
  }));
}

export function getEffectBaseEntries(): TokenEntry[] {
  return getEffectBaseGroups().flatMap((group) => group.tokens);
}

export function getEffectSemanticGroups(): TokenGroup[] {
  return effectSemanticCatalog.groups.map((group) => ({
    comment: group.comment,
    tokens: group.tokens.map((token) => ({
      name: token.name,
      layer: 'semantic' as const,
      cssVar: `.${token.name}`,
      detailLines: distClassDetailLines('effect', token.name),
    })),
  }));
}

export function getEffectTokenByName(name: string): TokenEntry | undefined {
  const base = getEffectBaseEntries().find((entry) => entry.name === name);
  if (base) {
    return base;
  }

  for (const group of getEffectSemanticGroups()) {
    const token = group.tokens.find((entry) => entry.name === name);
    if (token) {
      return token;
    }
  }

  return undefined;
}
