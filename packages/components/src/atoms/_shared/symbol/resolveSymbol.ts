import { resolveCryptoAssetFileName } from '../crypto/cryptoAssetNames.generated.js';
import { cryptoAssetNames } from '../crypto/cryptoAssetNames.generated.js';
import { iconAssetNames } from '../icon/iconAssetNames.generated.js';
import { resolveIconAssetFileName } from '../icon/iconAssetAliases.js';

export type SymbolKind = 'Icon' | 'Crypto' | 'Network';

const iconNameSet = new Set<string>(iconAssetNames);

export function resolveSymbolKind(name: string): SymbolKind {
  const iconFileName = resolveIconAssetFileName(name);
  if (iconNameSet.has(iconFileName)) return 'Icon';

  const cryptoFileName = resolveCryptoAssetFileName(name);
  if (cryptoFileName) {
    return cryptoFileName.toLowerCase().startsWith('eds-') ? 'Crypto' : 'Network';
  }

  return 'Icon';
}

export function formatSymbolDisplayName(name: string): string {
  return name.replace(/^eds-/i, '');
}

export { cryptoAssetNames, iconAssetNames };
