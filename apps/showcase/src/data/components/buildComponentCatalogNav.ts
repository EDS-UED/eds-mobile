import { figmaComponentCatalog, type FigmaComponentEntry } from '@eds/mobile-components/catalog';

import {
  getShowcaseComponentCatalog,
  isShowcaseEntryImplemented,
  type ShowcaseCatalogEntry,
} from './showcaseCatalog.js';
import { SHOWCASE_GLASS_EG_SLUG } from './showcaseInfraCatalog.js';
import { familyBodyPreviewSlug } from './rnDocRegistry';

export type AtomGalleryFamily = 'icon' | 'crypto' | 'avatar';

export type CatalogTier = FigmaComponentEntry['tier'];

export const TIER_ORDER: CatalogTier[] = ['atoms', 'molecules', 'organisms', 'templates'];

/** Stack / inner nav — 英文 + 中文。 */
export const TIER_LABELS: Record<CatalogTier, string> = {
  atoms: 'Atoms 原子',
  molecules: 'Molecules 分子',
  organisms: 'Organisms 有机体',
  templates: 'Templates 模板',
};

/** Home card primary title — Latin only so row title uses one bundled SemiBold face (同 Token 页 Color / Scale)。 */
export const TIER_HOME_TITLES: Record<CatalogTier, string> = {
  atoms: 'Atoms',
  molecules: 'Molecules',
  organisms: 'Organisms',
  templates: 'Templates',
};

export const FAMILY_LABELS: Record<string, string> = {
  text: 'Text 文字',
  divider: 'Divider 分割线',
  avatar: 'Avatar 头像',
  crypto: 'Crypto 币种',
  icon: 'Icon 图标',
  glass: 'Glass 玻璃',
  button: 'Button 按钮',
  input: 'Input 输入',
  tag: 'Tag 标签',
  toggle: 'Toggle 切换',
  tab: 'Tab 标签页',
  dropdown: 'Dropdown 下拉',
  feedback: 'Feedback 反馈',
  'tab-bar': 'TabBar 底栏',
  'nav-bar': 'NavBar 导航栏',
  popovers: 'Popovers 浮层',
  index: 'Index 索引',
};

const GALLERY_FAMILIES: Record<string, AtomGalleryFamily> = {
  icon: 'icon',
  crypto: 'crypto',
  avatar: 'avatar',
};

export type ComponentFamilyNav = {
  tier: CatalogTier;
  family: string;
  label: string;
  directory: string;
  entries: ShowcaseCatalogEntry[];
  implementedCount: number;
  bodySlug?: string;
  galleryFamily?: AtomGalleryFamily;
  /** showcase 基础设施族（非 Figma 202 条目）。 */
  showcaseInfra?: boolean;
};

export type ComponentTierNav = {
  tier: CatalogTier;
  label: string;
  directory: string;
  families: ComponentFamilyNav[];
  totalCount: number;
  implementedCount: number;
};

/** Tier 页单独成行的条目（源码仍在 catalog family 目录下）。 */
const SHOWCASE_NAV_FAMILY_BY_SLUG: Record<string, { family: string; directory: string }> = {
  'tab-bar-nav-bar': {
    family: 'nav-bar',
    directory: 'packages/components/src/organisms/tab-bar/nav-bar',
  },
};

function showcaseNavFamily(entry: ShowcaseCatalogEntry): string {
  return SHOWCASE_NAV_FAMILY_BY_SLUG[entry.slug]?.family ?? entry.family;
}

function familyDirectory(tier: CatalogTier, family: string) {
  const promoted = Object.values(SHOWCASE_NAV_FAMILY_BY_SLUG).find((item) => item.family === family);
  return promoted?.directory ?? `packages/components/src/${tier}/${family}`;
}

function resolveBodySlug(family: string): string | undefined {
  const bodySlug = `${family}-body`;
  if (familyBodyPreviewSlug[bodySlug]) {
    return bodySlug;
  }
  if (figmaComponentCatalog.some((entry) => entry.slug === bodySlug)) {
    return bodySlug;
  }
  return undefined;
}

export function buildComponentCatalogNav(): ComponentTierNav[] {
  const byTier = new Map<CatalogTier, Map<string, FigmaComponentEntry[]>>();

  for (const entry of getShowcaseComponentCatalog()) {
    const families = byTier.get(entry.tier) ?? new Map<string, FigmaComponentEntry[]>();
    const family = showcaseNavFamily(entry);
    const list = families.get(family) ?? [];
    list.push(entry);
    families.set(family, list);
    byTier.set(entry.tier, families);
  }

  return TIER_ORDER.filter((tier) => byTier.has(tier)).map((tier) => {
    const families = byTier.get(tier)!;
    const familyNavs = [...families.entries()]
      .map(([family, entries]) => {
        const sorted = entries.slice().sort((a, b) => a.exportName.localeCompare(b.exportName));
        return {
          tier,
          family,
          label: FAMILY_LABELS[family] ?? family,
          directory: familyDirectory(tier, family),
          entries: sorted,
          implementedCount: sorted.filter(isShowcaseEntryImplemented).length,
          bodySlug: resolveBodySlug(family),
          galleryFamily: GALLERY_FAMILIES[family],
          showcaseInfra: family === 'glass',
        } satisfies ComponentFamilyNav;
      })
      .sort((a, b) => a.label.localeCompare(b.label, 'zh-CN'));

    const totalCount = familyNavs.reduce((sum, item) => sum + item.entries.length, 0);
    const implementedCount = familyNavs.reduce((sum, item) => sum + item.implementedCount, 0);

    return {
      tier,
      label: TIER_HOME_TITLES[tier],
      directory: `packages/components/src/${tier}`,
      families: familyNavs,
      totalCount,
      implementedCount,
    };
  });
}

export const componentCatalogNav = buildComponentCatalogNav();

export function findFamilyNav(tier: CatalogTier, family: string): ComponentFamilyNav | undefined {
  return componentCatalogNav.find((item) => item.tier === tier)?.families.find((item) => item.family === family);
}

/** 族级组件名 — `Eg` + PascalCase(family)，Tier / 族页标题与列表统一。 */
export function familyEgComponentName(family: string): string {
  const pascal = family
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  return `Eg${pascal}`;
}

export function familyTierRowTitle(family: string): string {
  return familyEgComponentName(family);
}

export function familyTierRowHint(nav: ComponentFamilyNav): string {
  if (nav.family === 'glass') {
    return '容器玻璃材质';
  }
  return `${nav.directory} · 已实现 ${nav.implementedCount}/${nav.entries.length}`;
}

export function familyTierPressHref(nav: ComponentFamilyNav): string {
  if (nav.family === 'glass') {
    return `/(components)/detail/${SHOWCASE_GLASS_EG_SLUG}`;
  }
  if (!nav.bodySlug && !nav.galleryFamily && nav.entries.length === 1) {
    return `/(components)/detail/${nav.entries[0]!.slug}`;
  }
  return `/(components)/family/${nav.tier}/${nav.family}`;
}
