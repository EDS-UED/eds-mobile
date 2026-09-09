const cryptoSvgModules = import.meta.glob('./*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function fileBaseFromModulePath(path: string): string {
  return path.replace(/^\.\//, '').replace(/\.svg$/i, '');
}

/** 与 SVG 文件名一致（无 .svg 后缀），作为 `EgCrypto` 的 `name`。 */
export const cryptoNames = Object.keys(cryptoSvgModules)
  .map(fileBaseFromModulePath)
  .sort((a, b) => a.localeCompare(b));

export type CryptoName = (typeof cryptoNames)[number];

export const cryptoFileNames = cryptoNames;

export type ProcessedCrypto = {
  markup: string;
};

/** `eds-*` 文件名前缀为币种图标；其余（如 `Ethereum Mainnet`）为网络链图标。 */
export type CryptoAssetKind = 'Crypto' | 'Network';

/** 按 SVG 文件名约定解析资产类型，不改变 `name` 本身。 */
export function resolveCryptoAssetKind(name: string): CryptoAssetKind {
  return name.toLowerCase().startsWith('eds-') ? 'Crypto' : 'Network';
}

/** 展示用名称：去掉 `eds-` 前缀，不改变 `EgCrypto` 的 `name` API。 */
export function formatCryptoDisplayName(name: string): string {
  return name.replace(/^eds-/i, '');
}

/** 业务侧 `name`：canonical 解析后再格式化为展示名。 */
export function toCryptoBusinessName(name: string): string {
  const fileName = resolveFileName(name.trim());
  return formatCryptoDisplayName(fileName ?? name.trim());
}

const markupCache = new Map<string, ProcessedCrypto>();

function resolveFileName(name: string): string | undefined {
  const trimmed = name.trim();
  if (!trimmed) return undefined;

  if (cryptoSvgModules[`./${trimmed}.svg`]) return trimmed;

  if (!trimmed.toLowerCase().startsWith('eds-')) {
    const withPrefix = `eds-${trimmed}`;
    if (cryptoSvgModules[`./${withPrefix}.svg`]) return withPrefix;
  }

  return undefined;
}

export function resolveCryptoFileName(name: string): string | undefined {
  return resolveFileName(name);
}

/** 原样输出 SVG 源文件，仅去掉 XML 声明。 */
function prepareRawCryptoMarkup(raw: string): string {
  return raw.replace(/<\?xml[^?]*\?\>\s*/i, '').trim();
}

export function getProcessedCrypto(name: string): ProcessedCrypto | undefined {
  const fileName = resolveFileName(name);
  if (!fileName) return undefined;

  const cached = markupCache.get(fileName);
  if (cached) return cached;

  const raw = cryptoSvgModules[`./${fileName}.svg`];
  if (!raw) return undefined;

  const processed = { markup: prepareRawCryptoMarkup(raw) };
  markupCache.set(fileName, processed);
  return processed;
}
