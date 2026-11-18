import type { FigmaComponentEntry } from '@eds/mobile-components/catalog';

import {
  familyEgComponentName,
  familyTierRowTitle,
  type ComponentFamilyNav,
} from './buildComponentCatalogNav.js';
import { familyBodyPreviewSlug } from './familyBodyPreviewSlug.js';
import { isShowcaseInfraEntry, type ShowcaseCatalogEntry } from './showcaseCatalog.js';

export const SHOWCASE_FAMILY_SECTION_BODY = '本体';
export const SHOWCASE_FAMILY_SECTION_SCENES = '场景化';
export const SHOWCASE_FAMILY_SECTION_COMPOSITION = '构成';
/** Avatar 族 — 合并场景化 + 构成。 */
export const SHOWCASE_FAMILY_SECTION_ASSETS = '资产';
export const SHOWCASE_FAMILY_SECTION_EMPTY = '等待添加';

/** 构成本体的子项 — 按族 slug 白名单（非场景业务组合）。 */
const SHOWCASE_FAMILY_COMPOSITION_SLUGS: Record<string, readonly string[]> = {
  'tab-bar': ['tab-bar-item', 'tab-bar-glass-bg'],
};

/** Button 色调已由 EgButton 本体定制；不再单独列场景页。 */
const SHOWCASE_BUTTON_HIDDEN_SCENE_SLUGS = new Set([
  'button-decor',
  'button-danger',
  'button-option',
  'button-glass',
  'button-icon-container',
]);

/** 列表主标题 — 本体 export（如 EgTabBar）；无映射时回退 `-base` 或族 key。 */
export function resolveFamilyBodyEntry(
  nav: ComponentFamilyNav,
): FigmaComponentEntry | undefined {
  if (nav.bodySlug) {
    const previewSlug = familyBodyPreviewSlug[nav.bodySlug] ?? nav.bodySlug;
    const mapped = nav.entries.find((entry) => entry.slug === previewSlug);
    if (mapped) {
      return mapped;
    }
    const bodyEntry = nav.entries.find((entry) => entry.slug === nav.bodySlug);
    if (bodyEntry) {
      return bodyEntry;
    }
  }

  const baseSlug = `${nav.family}-base`;
  const base = nav.entries.find((entry) => entry.slug === baseSlug);
  if (base) {
    return base;
  }

  const suffixBase = nav.entries.find((entry) => entry.slug.endsWith('-base'));
  if (suffixBase) {
    return suffixBase;
  }

  /** 仅一项的族（如 Divider · NavBar）— 该项即本体，不列入场景化。 */
  if (nav.entries.length === 1) {
    return nav.entries[0];
  }

  return undefined;
}

export function resolveFamilyCompositionEntries(nav: ComponentFamilyNav): FigmaComponentEntry[] {
  const slugs = SHOWCASE_FAMILY_COMPOSITION_SLUGS[nav.family];
  if (!slugs?.length) {
    return [];
  }
  const order = new Map(slugs.map((slug, index) => [slug, index]));
  return nav.entries
    .filter((entry) => order.has(entry.slug))
    .sort((a, b) => (order.get(a.slug) ?? 0) - (order.get(b.slug) ?? 0));
}

export function resolveFamilySceneEntries(nav: ComponentFamilyNav): FigmaComponentEntry[] {
  const body = resolveFamilyBodyEntry(nav);
  const compositionSlugs = new Set(resolveFamilyCompositionEntries(nav).map((entry) => entry.slug));
  const withoutBody = body
    ? nav.entries.filter((entry) => entry.slug !== body.slug)
    : nav.entries;
  const withoutComposition = withoutBody.filter((entry) => !compositionSlugs.has(entry.slug));
  const withoutAssetIcons =
    nav.family === 'symbol'
      ? withoutComposition.filter((entry) => entry.family !== 'icon' && entry.family !== 'crypto')
      : withoutComposition;
  if (nav.family !== 'button') {
    return withoutAssetIcons;
  }
  return withoutAssetIcons.filter((entry) => !SHOWCASE_BUTTON_HIDDEN_SCENE_SLUGS.has(entry.slug));
}

/** 族页 Stack 大标题 — `Eg` + 族名（与 Tier 族列表一致）。 */
export function resolveFamilyPageTitle(nav: ComponentFamilyNav): string {
  if (nav.family === 'glass') {
    return 'Glass';
  }
  if (nav.family === 'scroll-edge') {
    return 'Scroll Edge';
  }
  return familyEgComponentName(nav.family);
}

/**
 * 场景化列表标题 — 对齐 Desktop「Eg{族}{场景}」可读顺序；catalog export 不变。
 * Mobile TabBar：EgCregisTabBar → EgTabBarCregis。
 */
export function showcaseSceneListTitle(family: string, exportName: string): string {
  if (exportName === 'EgSymbolAction') {
    return 'EgSymbolAction';
  }
  const tabBar = /^Eg(.+)TabBar$/.exec(exportName);
  if (tabBar?.[1] && family === 'tab-bar') {
    return `EgTabBar${tabBar[1]}`;
  }

  const button = /^Eg(.+)Button(Alt)?$/.exec(exportName);
  if (button?.[1] && family === 'button') {
    const suffix = button[2] ?? '';
    return `EgButton${button[1]}${suffix}`;
  }

  const popover = /^Eg(.+)Popover$/.exec(exportName);
  if (popover?.[1] && family === 'popovers') {
    return `EgPopover${popover[1]}`;
  }

  const tag = /^Eg(.+)Tag(Alt)?$/.exec(exportName);
  if (tag?.[1] && family === 'tag') {
    const suffix = tag[2] ?? '';
    return `EgTag${tag[1]}${suffix}`;
  }

  return exportName;
}

/** 族场景列表标题 — infra 用 figmaName（Eg*），Figma 项用场景化标题。 */
export function showcaseFamilyEntryTitle(family: string, entry: ShowcaseCatalogEntry): string {
  if (isShowcaseInfraEntry(entry)) {
    return entry.figmaName;
  }
  return showcaseSceneListTitle(family, entry.exportName);
}

/** 构成列表标题 — 默认 catalog exportName。 */
export function showcaseCompositionListTitle(entry: FigmaComponentEntry): string {
  return entry.exportName;
}

/** 族列表副文本 — 本体（含 `*-body`）一律不展示 showcaseLabel。 */
export function showcaseFamilyEntryHint(
  bodyEntry: FigmaComponentEntry | undefined,
  entry: ShowcaseCatalogEntry,
): string | undefined {
  if (!isShowcaseInfraEntry(entry)) {
    return undefined;
  }
  if (bodyEntry?.slug === entry.slug) {
    return undefined;
  }
  if (entry.slug.endsWith('-body')) {
    return undefined;
  }
  if (entry.slug === 'tab-bar-text') {
    return undefined;
  }
  return entry.showcaseLabel;
}
