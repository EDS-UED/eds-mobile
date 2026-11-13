#!/usr/bin/env node
/**
 * Sync Desktop SVG assets → process → generated RN registries.
 * Source: packages/components/src/atoms/_assets/{icons,crypto}
 *
 * Icons/crypto markups are split into lazy-loaded chunks so dev servers
 * do not parse multi-MB generated TS on startup.
 */
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import mobileTheme from '@eds/mobile-tokens/theme';
import { processSvg } from '../src/atoms/_shared/icon/processSvg.ts';

/** 与 `legacyFigmaBaseInk.ts` / `processSvg` 保持一致 · Desktop 同步归一化。 */
const LEGACY_FIGMA_BASE_INK = '#020304';

function normalizeLegacyBaseInkInMarkup(raw) {
  const ink = String(mobileTheme.colors.light.base ?? '#000000').toLowerCase();
  return raw
    .replace(new RegExp(`${LEGACY_FIGMA_BASE_INK}([0-9a-f]{2})?`, 'gi'), (_match, alpha) =>
      alpha ? `${ink}${alpha}` : ink,
    )
    .replace(/color\(display-p3 0\.0078 0\.0118 0\.0157\)/gi, 'color(display-p3 0 0 0)');
}

/** Desktop 同步仍可能带回旧基色；落盘前统一为当前 eds-base。 */
function normalizeSyncedSvgDir(targetDir) {
  if (!existsSync(targetDir)) return;
  for (const file of readdirSync(targetDir)) {
    if (!file.endsWith('.svg')) continue;
    const filePath = join(targetDir, file);
    const raw = readFileSync(filePath, 'utf8');
    const next = normalizeLegacyBaseInkInMarkup(raw);
    if (next !== raw) {
      writeFileSync(filePath, next);
    }
  }
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(__dirname, '..');
const assetsIcons = join(pkgRoot, 'src/atoms/_assets/icons');
const assetsCrypto = join(pkgRoot, 'src/atoms/_assets/crypto');
/** Sibling checkout: ~/Projects/eds-desktop — read-only copy source (override with EDS_DESKTOP_ROOT). */
const desktopComponentsRoot = process.env.EDS_DESKTOP_ROOT
  ? join(process.env.EDS_DESKTOP_ROOT, 'packages/components/src/atoms')
  : join(pkgRoot, '../../../eds-desktop/packages/components/src/atoms');
const desktopIcons = join(desktopComponentsRoot, 'icons');
const desktopCrypto = join(desktopComponentsRoot, 'crypto');

const ICON_CHUNK_COUNT = 8;
const CRYPTO_CHUNK_COUNT = 16;

function syncAssetsFromDesktop(sourceDir, targetDir) {
  if (!existsSync(sourceDir)) {
    console.warn(`⚠ Desktop assets not found (skip sync): ${sourceDir}`);
    return;
  }
  mkdirSync(targetDir, { recursive: true });
  const synced = new Set();
  for (const file of readdirSync(sourceDir)) {
    if (!file.endsWith('.svg')) continue;
    cpSync(join(sourceDir, file), join(targetDir, file), { force: true });
    synced.add(file);
  }
  for (const file of readdirSync(targetDir)) {
    if (!file.endsWith('.svg') || synced.has(file)) continue;
    rmSync(join(targetDir, file), { force: true });
  }
}

function prepareRawMarkup(raw) {
  return raw.replace(/<\?xml[^?]*\?\>\s*/i, '').trim();
}

function listSvgBaseNames(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => name.endsWith('.svg'))
    .map((name) => name.replace(/\.svg$/i, ''))
    .sort((a, b) => a.localeCompare(b));
}

function chunkIdForName(name, chunkCount) {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return hash % chunkCount;
}

function buildChunkSwitchCases(chunkCount, assetsDir) {
  const lines = [];
  for (let i = 0; i < chunkCount; i += 1) {
    const id = String(i).padStart(2, '0');
    lines.push(
      `    case ${i}: return require('${assetsDir}/chunk-${id}.generated.js').default;`,
    );
  }
  lines.push(`    default: return {};`);
  return lines.join('\n');
}

function writeChunkFiles(targetDir, chunkCount, entries, typeImport) {
  rmSync(targetDir, { recursive: true, force: true });
  mkdirSync(targetDir, { recursive: true });

  const buckets = Array.from({ length: chunkCount }, () => ({}));
  for (const [fileName, value] of Object.entries(entries)) {
    buckets[chunkIdForName(fileName, chunkCount)][fileName] = value;
  }

  for (let i = 0; i < chunkCount; i += 1) {
    const id = String(i).padStart(2, '0');
    writeFileSync(
      join(targetDir, `chunk-${id}.generated.ts`),
      `/** Auto-generated lazy chunk — do not import directly. */\n` +
        `${typeImport}\n\n` +
        `const assets: Record<string, Asset> = ${JSON.stringify(buckets[i], null, 2)};\n\n` +
        `export default assets;\n`,
    );
  }
}

function writeIconRegistry() {
  const names = listSvgBaseNames(assetsIcons);
  const entries = {};

  for (const fileName of names) {
    const raw = readFileSync(join(assetsIcons, `${fileName}.svg`), 'utf8');
    entries[fileName] = processSvg(fileName, raw);
  }

  const chunkMap = {};
  for (const fileName of names) {
    chunkMap[fileName] = chunkIdForName(fileName, ICON_CHUNK_COUNT);
  }

  writeFileSync(
    join(pkgRoot, 'src/atoms/_shared/icon/iconAssetNames.generated.ts'),
    `/** Auto-generated icon asset names. Run: pnpm generate:assets */\n` +
      `export const iconAssetNames = ${JSON.stringify(names, null, 2)} as const;\n`,
  );

  writeFileSync(
    join(pkgRoot, 'src/atoms/_shared/icon/iconAssetChunkMap.generated.ts'),
    `/** Auto-generated icon chunk routing. Run: pnpm generate:assets */\n` +
      `export const iconAssetChunkByFileName: Record<string, number> = ${JSON.stringify(chunkMap, null, 2)};\n` +
      `export const iconAssetChunkCount = ${ICON_CHUNK_COUNT};\n`,
  );

  writeChunkFiles(
    join(pkgRoot, 'src/atoms/_shared/icon/iconAssets'),
    ICON_CHUNK_COUNT,
    entries,
    `import type { ProcessedIcon } from '../processSvg.js';\n\ntype Asset = ProcessedIcon;`,
  );

  writeFileSync(
    join(pkgRoot, 'src/atoms/_shared/icon/iconAssetLoader.ts'),
    `/** Lazy icon registry — chunks load on first use. */\n` +
      `import type { ProcessedIcon } from './processSvg.js';\n` +
      `import { resolveIconAssetFileName } from './iconAssetAliases.js';\n` +
      `import { iconAssetChunkByFileName, iconAssetChunkCount } from './iconAssetChunkMap.generated.js';\n\n` +
      `const chunkPromises = new Map<number, Promise<Record<string, ProcessedIcon>>>();\n\n` +
      `function resolveIconChunkModule(chunkId: number): Record<string, ProcessedIcon> {\n` +
      `  switch (chunkId) {\n` +
      buildChunkSwitchCases(ICON_CHUNK_COUNT, './iconAssets') +
      `\n  }\n` +
      `}\n\n` +
      `async function loadIconChunk(chunkId: number): Promise<Record<string, ProcessedIcon>> {\n` +
      `  if (!chunkPromises.has(chunkId)) {\n` +
      `    chunkPromises.set(chunkId, Promise.resolve(resolveIconChunkModule(chunkId)));\n` +
      `  }\n` +
      `  return chunkPromises.get(chunkId)!;\n` +
      `}\n\n` +
      `export async function loadIconAsset(assetName: string): Promise<ProcessedIcon | undefined> {\n` +
      `  const fileName = resolveIconAssetFileName(assetName);\n` +
      `  const chunkId = iconAssetChunkByFileName[fileName];\n` +
      `  if (chunkId === undefined) return undefined;\n` +
      `  const chunk = await loadIconChunk(chunkId);\n` +
      `  return chunk[fileName];\n` +
      `}\n\n` +
      `export async function preloadIconChunks(chunkIds: number[]): Promise<void> {\n` +
      `  await Promise.all(chunkIds.map((id) => loadIconChunk(id)));\n` +
      `}\n\n` +
      `export async function preloadAllIconChunks(): Promise<void> {\n` +
      `  const ids = Array.from({ length: iconAssetChunkCount }, (_, index) => index);\n` +
      `  await preloadIconChunks(ids);\n` +
      `}\n`,
  );

  console.log(
    `✓ icon assets: ${names.length} → ${ICON_CHUNK_COUNT} chunks + iconAssetNames.generated.ts`,
  );
}

function writeCryptoRegistry() {
  const names = listSvgBaseNames(assetsCrypto);
  const entries = {};

  for (const fileName of names) {
    const raw = readFileSync(join(assetsCrypto, `${fileName}.svg`), 'utf8');
    entries[fileName] = { markup: prepareRawMarkup(raw) };
  }

  const chunkMap = {};
  for (const fileName of names) {
    chunkMap[fileName] = chunkIdForName(fileName, CRYPTO_CHUNK_COUNT);
  }

  writeFileSync(
    join(pkgRoot, 'src/atoms/_shared/crypto/cryptoAssetNames.generated.ts'),
    `/** Auto-generated crypto asset names. Run: pnpm generate:assets */\n` +
      `export const cryptoAssetNames = ${JSON.stringify(names, null, 2)} as const;\n\n` +
      `const cryptoAssetNameSet = new Set<string>(cryptoAssetNames);\n\n` +
      `export function resolveCryptoAssetFileName(name: string): string | undefined {\n` +
      `  const trimmed = name.trim();\n` +
      `  if (!trimmed) return undefined;\n` +
      `  if (cryptoAssetNameSet.has(trimmed)) return trimmed;\n` +
      `  if (!trimmed.toLowerCase().startsWith('eds-')) {\n` +
      `    const withPrefix = \`eds-\${trimmed}\`;\n` +
      `    if (cryptoAssetNameSet.has(withPrefix)) return withPrefix;\n` +
      `  }\n` +
      `  return undefined;\n` +
      `}\n`,
  );

  writeFileSync(
    join(pkgRoot, 'src/atoms/_shared/crypto/cryptoAssetChunkMap.generated.ts'),
    `/** Auto-generated crypto chunk routing. Run: pnpm generate:assets */\n` +
      `export const cryptoAssetChunkByFileName: Record<string, number> = ${JSON.stringify(chunkMap, null, 2)};\n` +
      `export const cryptoAssetChunkCount = ${CRYPTO_CHUNK_COUNT};\n`,
  );

  writeChunkFiles(
    join(pkgRoot, 'src/atoms/_shared/crypto/cryptoAssets'),
    CRYPTO_CHUNK_COUNT,
    entries,
    `type Asset = { markup: string };`,
  );

  writeFileSync(
    join(pkgRoot, 'src/atoms/_shared/crypto/cryptoAssetLoader.ts'),
    `/** Lazy crypto registry — chunks load on first use. */\n` +
      `import { cryptoAssetChunkByFileName, cryptoAssetChunkCount } from './cryptoAssetChunkMap.generated.js';\n\n` +
      `type CryptoAsset = { markup: string };\n\n` +
      `const chunkPromises = new Map<number, Promise<Record<string, CryptoAsset>>>();\n\n` +
      `function resolveCryptoChunkModule(chunkId: number): Record<string, CryptoAsset> {\n` +
      `  switch (chunkId) {\n` +
      buildChunkSwitchCases(CRYPTO_CHUNK_COUNT, './cryptoAssets') +
      `\n  }\n` +
      `}\n\n` +
      `async function loadCryptoChunk(chunkId: number): Promise<Record<string, CryptoAsset>> {\n` +
      `  if (!chunkPromises.has(chunkId)) {\n` +
      `    chunkPromises.set(chunkId, Promise.resolve(resolveCryptoChunkModule(chunkId)));\n` +
      `  }\n` +
      `  return chunkPromises.get(chunkId)!;\n` +
      `}\n\n` +
      `export async function loadCryptoAsset(fileName: string): Promise<CryptoAsset | undefined> {\n` +
      `  const chunkId = cryptoAssetChunkByFileName[fileName];\n` +
      `  if (chunkId === undefined) return undefined;\n` +
      `  const chunk = await loadCryptoChunk(chunkId);\n` +
      `  return chunk[fileName];\n` +
      `}\n\n` +
      `export async function preloadCryptoChunks(chunkIds: number[]): Promise<void> {\n` +
      `  await Promise.all(chunkIds.map((id) => loadCryptoChunk(id)));\n` +
      `}\n\n` +
      `export async function preloadAllCryptoChunks(): Promise<void> {\n` +
      `  const ids = Array.from({ length: cryptoAssetChunkCount }, (_, index) => index);\n` +
      `  await preloadCryptoChunks(ids);\n` +
      `}\n`,
  );

  console.log(
    `✓ crypto assets: ${names.length} → ${CRYPTO_CHUNK_COUNT} chunks + cryptoAssetNames.generated.ts`,
  );
}

syncAssetsFromDesktop(desktopIcons, assetsIcons);
syncAssetsFromDesktop(desktopCrypto, assetsCrypto);
normalizeSyncedSvgDir(assetsIcons);
normalizeSyncedSvgDir(assetsCrypto);
writeIconRegistry();
writeCryptoRegistry();

// Legacy monolithic registries — remove so dev servers cannot accidentally import them.
for (const legacy of [
  join(pkgRoot, 'src/atoms/_shared/icon/iconAssets.generated.ts'),
  join(pkgRoot, 'src/atoms/_shared/crypto/cryptoAssets.generated.ts'),
]) {
  rmSync(legacy, { force: true });
}
