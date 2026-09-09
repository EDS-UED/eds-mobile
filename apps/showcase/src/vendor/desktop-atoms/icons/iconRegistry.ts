import { processSvg, type IconFillTone, type IconKind, type ProcessedIcon } from './processSvg';
import edsApplication5Raw from '../avatar/eds-application-5.svg?raw';
import edsApplication21Raw from '../avatar/eds-application-21.svg?raw';
import edsApplication22Raw from '../avatar/eds-application-22.svg?raw';

const iconSvgModules = import.meta.glob('./*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const appEntrySvgModules = import.meta.glob('../avatar/eds-*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const svgModules: Record<string, string> = { ...iconSvgModules };

/** 显式注册：新加入 avatar 的 eds-* 图标在 dev 下 glob 需重启才生效，静态 import 可立即 HMR。 */
const EXPLICIT_AVATAR_ICONS: Record<string, string> = {
  'eds-application-5': edsApplication5Raw,
  'eds-application-21': edsApplication21Raw,
  'eds-application-22': edsApplication22Raw,
};

for (const [name, raw] of Object.entries(EXPLICIT_AVATAR_ICONS)) {
  svgModules[`./${name}.svg`] = raw;
}

function avatarIconBaseName(path: string): string {
  const fileName = path.split('/').pop() ?? path;
  return fileName.replace(/\.svg$/i, '');
}

for (const [path, raw] of Object.entries(appEntrySvgModules)) {
  const base = avatarIconBaseName(path);
  svgModules[`./${base}.svg`] = raw;
}

function fileBaseFromModulePath(path: string): string {
  return path.replace(/^\.\//, '').replace(/\.svg$/i, '');
}

/** 与 SVG 文件名一致（无 .svg 后缀），作为 `EgIcon` 的 `name`。 */
export const iconNames = Object.keys(svgModules)
  .map(fileBaseFromModulePath)
  .sort((a, b) => a.localeCompare(b));

export type IconName = (typeof iconNames)[number];

export const iconFileNames = iconNames;

const processedCache = new Map<string, ProcessedIcon>();
/** Bump when processSvg output shape changes (invalidates in-memory cache in long dev sessions). */
const PROCESSED_ICON_CACHE_VERSION = 8;
let activeCacheVersion = 0;

function ensureProcessedCacheFresh() {
  if (activeCacheVersion === PROCESSED_ICON_CACHE_VERSION) return;
  processedCache.clear();
  activeCacheVersion = PROCESSED_ICON_CACHE_VERSION;
}

/** 对外 icon name → 磁盘文件名（修正历史文件名差异）。 */
const ICON_NAME_ALIASES: Record<string, string> = {
  'eds-global-payments-fill': 'eds-global-payments -fill',
};

function resolveFileName(name: string): string | undefined {
  const aliased = ICON_NAME_ALIASES[name] ?? name;
  if (svgModules[`./${aliased}.svg`]) return aliased;
  return undefined;
}

export function resolveIconFileName(name: string): string | undefined {
  return resolveFileName(name);
}

export function getProcessedIcon(name: string): ProcessedIcon | undefined {
  ensureProcessedCacheFresh();
  const fileName = resolveFileName(name);
  if (!fileName) return undefined;

  const cached = processedCache.get(fileName);
  if (cached) return cached;

  const raw = svgModules[`./${fileName}.svg`];
  if (!raw) return undefined;

  const processed = processSvg(fileName, raw);
  processedCache.set(fileName, processed);
  return processed;
}

export function getIconKind(name: string): IconKind | undefined {
  return getProcessedIcon(name)?.kind;
}

export function getIconFillTone(name: string): IconFillTone | undefined {
  return getProcessedIcon(name)?.fillTone;
}

if (import.meta.hot) {
  import.meta.hot.accept('./processSvg', () => {
    processedCache.clear();
  });
}
