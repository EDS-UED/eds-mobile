/** Lazy crypto registry — chunks load on first use. */
import { cryptoAssetChunkByFileName, cryptoAssetChunkCount } from './cryptoAssetChunkMap.generated.js';

type CryptoAsset = { markup: string };

const chunkPromises = new Map<number, Promise<Record<string, CryptoAsset>>>();

function resolveCryptoChunkModule(chunkId: number): Record<string, CryptoAsset> {
  switch (chunkId) {
    case 0: return require('./cryptoAssets/chunk-00.generated.js').default;
    case 1: return require('./cryptoAssets/chunk-01.generated.js').default;
    case 2: return require('./cryptoAssets/chunk-02.generated.js').default;
    case 3: return require('./cryptoAssets/chunk-03.generated.js').default;
    case 4: return require('./cryptoAssets/chunk-04.generated.js').default;
    case 5: return require('./cryptoAssets/chunk-05.generated.js').default;
    case 6: return require('./cryptoAssets/chunk-06.generated.js').default;
    case 7: return require('./cryptoAssets/chunk-07.generated.js').default;
    case 8: return require('./cryptoAssets/chunk-08.generated.js').default;
    case 9: return require('./cryptoAssets/chunk-09.generated.js').default;
    case 10: return require('./cryptoAssets/chunk-10.generated.js').default;
    case 11: return require('./cryptoAssets/chunk-11.generated.js').default;
    case 12: return require('./cryptoAssets/chunk-12.generated.js').default;
    case 13: return require('./cryptoAssets/chunk-13.generated.js').default;
    case 14: return require('./cryptoAssets/chunk-14.generated.js').default;
    case 15: return require('./cryptoAssets/chunk-15.generated.js').default;
    default: return {};
  }
}

async function loadCryptoChunk(chunkId: number): Promise<Record<string, CryptoAsset>> {
  if (!chunkPromises.has(chunkId)) {
    chunkPromises.set(chunkId, Promise.resolve(resolveCryptoChunkModule(chunkId)));
  }
  return chunkPromises.get(chunkId)!;
}

export async function loadCryptoAsset(fileName: string): Promise<CryptoAsset | undefined> {
  const chunkId = cryptoAssetChunkByFileName[fileName];
  if (chunkId === undefined) return undefined;
  const chunk = await loadCryptoChunk(chunkId);
  return chunk[fileName];
}

export async function preloadCryptoChunks(chunkIds: number[]): Promise<void> {
  await Promise.all(chunkIds.map((id) => loadCryptoChunk(id)));
}

export async function preloadAllCryptoChunks(): Promise<void> {
  const ids = Array.from({ length: cryptoAssetChunkCount }, (_, index) => index);
  await preloadCryptoChunks(ids);
}
