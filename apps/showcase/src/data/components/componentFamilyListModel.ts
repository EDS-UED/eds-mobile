import type { FigmaComponentEntry } from '@eds/mobile-components/catalog';

import { familyEgComponentName, type ComponentFamilyNav } from './buildComponentCatalogNav.js';
import { familyBodyPreviewSlug } from './rnDocRegistry.js';

export const SHOWCASE_FAMILY_SECTION_BODY = '本体';
export const SHOWCASE_FAMILY_SECTION_SCENES = '场景化';

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

export function resolveFamilySceneEntries(nav: ComponentFamilyNav): FigmaComponentEntry[] {
  const body = resolveFamilyBodyEntry(nav);
  const withoutBody = body
    ? nav.entries.filter((entry) => entry.slug !== body.slug)
    : nav.entries;
  if (nav.family !== 'button') {
    return withoutBody;
  }
  return withoutBody.filter((entry) => !SHOWCASE_BUTTON_HIDDEN_SCENE_SLUGS.has(entry.slug));
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
