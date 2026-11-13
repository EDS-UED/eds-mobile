import type { FigmaComponentEntry } from '@eds/mobile-components/catalog';

import { familyEgComponentName, type ComponentFamilyNav } from './buildComponentCatalogNav.js';
import { familyBodyPreviewSlug } from './familyBodyPreviewSlug.js';

export const SHOWCASE_FAMILY_SECTION_BODY = '本体';
export const SHOWCASE_FAMILY_SECTION_SCENES = '场景化';
export const SHOWCASE_FAMILY_SECTION_COMPOSITION = '构成';
export const SHOWCASE_FAMILY_SECTION_EMPTY = '等待添加';

/** 构成本体的子项 — 按族 slug 白名单（非场景业务组合）。 */
const SHOWCASE_FAMILY_COMPOSITION_SLUGS: Record<string, readonly string[]> = {
  'tab-bar': ['tab-bar-item', 'tab-bar-glass-bg'],
  'segmented-control': ['tab-base-segmented-control'],
};

/** Button 色调已由 EgButton 本体定制；不再单独列场景页。 */
const SHOWCASE_BUTTON_HIDDEN_SCENE_SLUGS = new Set([
  'button-decor',
  'button-danger',
  'button-option',
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
  }

  const baseSlug = `${nav.family}-base`;
  const base = nav.entries.find((entry) => entry.slug === baseSlug);
  if (base) {
    return base;
  }

  return nav.entries.find((entry) => entry.slug.endsWith('-base'));
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
  if (nav.family !== 'button') {
    return withoutComposition;
  }
  return withoutComposition.filter((entry) => !SHOWCASE_BUTTON_HIDDEN_SCENE_SLUGS.has(entry.slug));
}

/** 族页 Stack 大标题 — `Eg` + 族名（与 Tier 族列表一致）。 */
export function resolveFamilyPageTitle(nav: ComponentFamilyNav): string {
  return familyEgComponentName(nav.family);
}

/**
 * 场景化列表标题 — 对齐 Desktop「Eg{族}{场景}」可读顺序；catalog export 不变。
 * Mobile TabBar：EgCregisTabBar → EgTabBarCregis。
 */
export function showcaseSceneListTitle(family: string, exportName: string): string {
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

/** 构成列表标题 — 默认 catalog exportName。 */
export function showcaseCompositionListTitle(entry: FigmaComponentEntry): string {
  return entry.exportName;
}
