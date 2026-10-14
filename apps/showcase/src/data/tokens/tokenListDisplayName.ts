import { Platform } from 'react-native';

import type { TokenEntry } from '@/data/tokens/tokenCatalogTypes';

type TokenListLabelEntry = Pick<TokenEntry, 'name' | 'cssVar'> & { layer?: TokenEntry['layer'] };

/** List / hero primary label — Web: CSS var/class；iOS/Android: RN theme 表达。 */
export function resolveTokenListPrimaryLabel(categoryId: string, entry: TokenListLabelEntry): string {
  if (Platform.OS === 'web') {
    return entry.cssVar;
  }

  return resolveNativeTokenPrimaryLabel(categoryId, entry);
}

function resolveScaleThemeBucket(tokenName: string): string {
  if (tokenName.startsWith('scale-')) {
    return 'scale';
  }

  const match = /^([a-z]+)-/.exec(tokenName);
  return match?.[1] ?? 'spacing';
}

function resolveNativeTokenPrimaryLabel(categoryId: string, entry: TokenListLabelEntry): string {
  switch (categoryId) {
    case 'color':
      if (entry.layer === 'base') {
        return entry.cssVar.startsWith('eds-') ? entry.cssVar : `eds-${entry.name}`;
      }
      return `colors[${quote(entry.name)}]`;
    case 'scale': {
      const bucket = resolveScaleThemeBucket(entry.name);
      return `${bucket}[${quote(entry.name)}]`;
    }
    case 'effect':
      if (entry.name.startsWith('glass-')) {
        return entry.name;
      }
      return entry.name;
    case 'motion':
      if (entry.name.startsWith('motion-')) {
        return `resolveMotionRecipe(${quote(entry.name.replace(/^motion-/, ''))})`;
      }
      return entry.name;
    case 'typography':
      if (entry.name.startsWith('typography-')) {
        return `edsTypographyRole(${quote(entry.name.replace(/^typography-/, ''))})`;
      }
      return entry.name;
    default:
      return entry.name;
  }
}

function quote(value: string) {
  return `'${value}'`;
}
