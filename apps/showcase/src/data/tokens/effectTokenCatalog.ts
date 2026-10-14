import effectBaseSpec from '../../../../../packages/tokens/spec/effect/base.json';
import effectSemanticSpec from '../../../../../packages/tokens/spec/effect/semantic.json';

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
  return effectSemanticSpec.groups.map((group) => ({
    comment: group.comment,
    tokens: group.styles.map((style) => ({
      name: style.className,
      layer: 'semantic' as const,
      cssVar: `.${style.className}`,
      detailLines: distClassDetailLines('effect', style.className),
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
