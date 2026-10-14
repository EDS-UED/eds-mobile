/** Lazy icon registry — chunks load on first use. */
import type { ProcessedIcon } from './processSvg.js';
import { resolveIconAssetFileName } from './iconAssetAliases.js';
import { iconAssetChunkByFileName, iconAssetChunkCount } from './iconAssetChunkMap.generated.js';

const chunkPromises = new Map<number, Promise<Record<string, ProcessedIcon>>>();

function resolveIconChunkModule(chunkId: number): Record<string, ProcessedIcon> {
  switch (chunkId) {
    case 0: return require('./iconAssets/chunk-00.generated.js').default;
    case 1: return require('./iconAssets/chunk-01.generated.js').default;
    case 2: return require('./iconAssets/chunk-02.generated.js').default;
    case 3: return require('./iconAssets/chunk-03.generated.js').default;
    case 4: return require('./iconAssets/chunk-04.generated.js').default;
    case 5: return require('./iconAssets/chunk-05.generated.js').default;
    case 6: return require('./iconAssets/chunk-06.generated.js').default;
    case 7: return require('./iconAssets/chunk-07.generated.js').default;
    default: return {};
  }
}

async function loadIconChunk(chunkId: number): Promise<Record<string, ProcessedIcon>> {
  if (!chunkPromises.has(chunkId)) {
    chunkPromises.set(chunkId, Promise.resolve(resolveIconChunkModule(chunkId)));
  }
  return chunkPromises.get(chunkId)!;
}

export async function loadIconAsset(assetName: string): Promise<ProcessedIcon | undefined> {
  const fileName = resolveIconAssetFileName(assetName);
  const chunkId = iconAssetChunkByFileName[fileName];
  if (chunkId === undefined) return undefined;
  const chunk = await loadIconChunk(chunkId);
  return chunk[fileName];
}

export async function preloadIconChunks(chunkIds: number[]): Promise<void> {
  await Promise.all(chunkIds.map((id) => loadIconChunk(id)));
}

export async function preloadAllIconChunks(): Promise<void> {
  const ids = Array.from({ length: iconAssetChunkCount }, (_, index) => index);
  await preloadIconChunks(ids);
}
