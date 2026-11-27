import { figmaComponentCatalog, type FigmaComponentEntry } from '@eds/mobile-components/catalog';

import {
  getShowcaseComponentCatalog,
  isShowcaseEntryImplemented,
  type ShowcaseCatalogEntry,
} from './showcaseCatalog.js';
import { SHOWCASE_SCROLL_EDGE_EG_SLUG } from './showcaseInfraCatalog.js';
import { familyBodyPreviewSlug } from './familyBodyPreviewSlug.js';

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
  divider: 'Divider 分割线',
  avatar: 'Avatar 头像',
  crypto: 'Crypto 币种',
  /** gallery 旧链 `…/icon` — 与 symbol 同文案 */
  icon: 'Symbol 图标',
  glass: 'Glass 玻璃',
  'scroll-edge': 'Scroll Edge 滚动缘',
  button: 'Button 按钮',
  'glass-button': 'Glass Button 玻璃按钮',
  'symbol-button': 'Symbol Button 符号按钮',
  link: 'Link 链接',
  input: 'Input 输入',
  search: 'Search 搜索',
  textarea: 'Textarea 文本域',
  tag: 'Tag 标签',
  locate: 'Locate 定位',
  toggle: 'Toggle 切换',
  tab: 'Tab 标签页',
  'segmented-control': 'Segmented Control 分段',
  dropdown: 'Menu 菜单',
  feedback: 'Feedback 反馈',
  'tab-bar': 'TabBar 底栏',
  'nav-bar': 'NavBar 导航栏',
  popovers: 'Popovers 浮层',
  menu: 'Menu 菜单',
  sheets: 'Sheets 底部浮层',
  'data-list': 'Data List 数据列表',
  item: 'Item 设置行',
  index: 'Index 索引',
  page: 'Page 页面',
  'page-shot': 'Page Shot 弹层页',
  symbol: 'Symbol 图标',
};

/** Avatar 仍可用 gallery 路由；Symbol / Crypto 资产在族页网格展示。 */
const GALLERY_FAMILIES: Record<string, AtomGalleryFamily> = {
  avatar: 'avatar',
};

/** 仅在「数据」Tab 展示 — 不出现在 Components tier 族列表。 */
const SHOWCASE_COMPONENTS_NAV_EXCLUDED_FAMILIES = new Set(['data-list', 'item', 'text', 'input-compose']);

/** Figma catalog `icon` / `crypto` — EgSymbol 资产，并入 symbol 导航。 */
export const SHOWCASE_NAV_MERGE_ICON_INTO_SYMBOL = true;
export const SHOWCASE_NAV_MERGE_CRYPTO_INTO_SYMBOL = true;

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

/** Tier 页单独成行的条目（源码路径 / 族 / Tier 可与 Figma catalog 不同）。 */
const SHOWCASE_NAV_PROMOTE_BY_SLUG: Record<
  string,
  { family: string; tier?: CatalogTier; directory: string }
> = {
  'tab-bar-nav-bar': {
    family: 'nav-bar',
    directory: 'packages/components/src/organisms/tab-bar/nav-bar',
  },
  'symbol-body': {
    family: 'symbol',
    directory: 'packages/components/src/atoms/_shared/symbol',
  },
  'menu-body': {
    family: 'menu',
    tier: 'organisms',
    directory: 'packages/components/src/molecules/dropdown/menu',
  },
  'dropdown-trigger': {
    family: 'menu',
    tier: 'organisms',
    directory: 'packages/components/src/molecules/dropdown/menu',
  },
  'tab-segmented-control': {
    family: 'segmented-control',
    directory: 'packages/components/src/molecules/tab/segmented-control',
  },
  'tab-base-segmented-control': {
    family: 'segmented-control',
    directory: 'packages/components/src/molecules/tab/segmented-control-base',
  },
  [SHOWCASE_SCROLL_EDGE_EG_SLUG]: {
    family: 'scroll-edge',
    directory: 'packages/components/src/atoms/glass',
  },
  'page-body': {
    family: 'page',
    directory: 'packages/components/src/templates/page',
  },
  'page-shot-body': {
    family: 'page-shot',
    directory: 'packages/components/src/templates/page-shot',
  },
  'link-body': {
    family: 'link',
    directory: 'packages/components/src/molecules/button/link',
  },
  'button-body': {
    family: 'button',
    directory: 'packages/components/src/molecules/button/button',
  },
  'glass-button-body': {
    family: 'glass-button',
    directory: 'packages/components/src/molecules/button/button-glass',
  },
  'symbol-button-body': {
    family: 'symbol-button',
    directory: 'packages/components/src/molecules/button/button-symbol',
  },
  'button-glass': {
    family: 'glass-button',
    directory: 'packages/components/src/molecules/button/button-glass',
  },
  'button-icon-container': {
    family: 'symbol-button',
    directory: 'packages/components/src/molecules/button/button-symbol',
  },
  'input-body': {
    family: 'input',
    directory: 'packages/components/src/molecules/input/input',
  },
  'search-body': {
    family: 'search',
    directory: 'packages/components/src/molecules/input/search',
  },
  'textarea-body': {
    family: 'textarea',
    directory: 'packages/components/src/molecules/input/textarea',
  },
  'input-input': {
    family: 'input',
    directory: 'packages/components/src/molecules/input/input',
  },
  'input-search': {
    family: 'search',
    directory: 'packages/components/src/molecules/input/search',
  },
  'input-textarea': {
    family: 'textarea',
    directory: 'packages/components/src/molecules/input/textarea',
  },
  'input-quick-input': {
    family: 'input-compose',
    directory: 'packages/components/src/molecules/input/quick-input',
  },
  'input-pointer': {
    family: 'input-compose',
    directory: 'packages/components/src/molecules/input/input-pointer',
  },
  'input-combo-input-group': {
    family: 'input-compose',
    directory: 'packages/components/src/molecules/input/input-group',
  },
  'input-combo-text-input': {
    family: 'input-compose',
    directory: 'packages/components/src/molecules/input/combo-text-input',
  },
  'input-combo-textarea-input': {
    family: 'input-compose',
    directory: 'packages/components/src/molecules/input/combo-textarea-input',
  },
  'feedback-toast': {
    family: 'toast',
    directory: 'packages/components/src/molecules/feedback/toast',
  },
  'feedback-form-submission': {
    family: 'form-submission',
    directory: 'packages/components/src/molecules/feedback/form-submission',
  },
  'feedback-status-card': {
    family: 'status-card',
    directory: 'packages/components/src/molecules/feedback/status-card',
  },
  'feedback-reddot': {
    family: 'reddot',
    directory: 'packages/components/src/molecules/feedback/reddot',
  },
  'feedback-message': {
    family: 'message',
    directory: 'packages/components/src/molecules/feedback/message',
  },
  'feedback-streamer': {
    family: 'streamer',
    directory: 'packages/components/src/molecules/feedback/streamer',
  },
  'tag-color': {
    family: 'tag',
    directory: 'packages/components/src/molecules/tag/tag',
  },
  'toggle-switch': {
    family: 'switch',
    directory: 'packages/components/src/molecules/toggle/switch',
  },
  'toggle-checkbox': {
    family: 'checkbox',
    directory: 'packages/components/src/molecules/toggle/checkbox',
  },
  'toggle-radio': {
    family: 'radio',
    directory: 'packages/components/src/molecules/toggle/radio',
  },
  'toggle-decide': {
    family: 'decide',
    directory: 'packages/components/src/molecules/toggle/decide',
  },
  'tab-block': {
    family: 'toggle-block',
    directory: 'packages/components/src/molecules/tab/tab-block',
  },
  'tab-tabs': {
    family: 'tab',
    directory: 'packages/components/src/molecules/tab/tab',
  },
};

function showcaseNavTier(entry: ShowcaseCatalogEntry): CatalogTier {
  return SHOWCASE_NAV_PROMOTE_BY_SLUG[entry.slug]?.tier ?? entry.tier;
}

function showcaseNavFamily(entry: ShowcaseCatalogEntry): string {
  const family = SHOWCASE_NAV_PROMOTE_BY_SLUG[entry.slug]?.family ?? entry.family;
  if (SHOWCASE_NAV_MERGE_ICON_INTO_SYMBOL && family === 'icon') {
    return 'symbol';
  }
  if (SHOWCASE_NAV_MERGE_CRYPTO_INTO_SYMBOL && family === 'crypto') {
    return 'symbol';
  }
  return family;
}

function familyDirectory(tier: CatalogTier, family: string, slug?: string) {
  const promoted = slug ? SHOWCASE_NAV_PROMOTE_BY_SLUG[slug] : undefined;
  if (promoted?.directory) {
    return promoted.directory;
  }
  const byFamily = Object.values(SHOWCASE_NAV_PROMOTE_BY_SLUG).find((item) => item.family === family);
  return byFamily?.directory ?? `packages/components/src/${tier}/${family}`;
}

function resolveBodySlug(family: string): string | undefined {
  const bodySlug = `${family}-body`;
  if (familyBodyPreviewSlug[bodySlug]) {
    return bodySlug;
  }
  if (getShowcaseComponentCatalog().some((entry) => entry.slug === bodySlug)) {
    return bodySlug;
  }
  return undefined;
}

export function buildComponentCatalogNav(): ComponentTierNav[] {
  const byTier = new Map<CatalogTier, Map<string, FigmaComponentEntry[]>>();

  for (const entry of getShowcaseComponentCatalog()) {
    const family = showcaseNavFamily(entry);
    if (SHOWCASE_COMPONENTS_NAV_EXCLUDED_FAMILIES.has(family)) {
      continue;
    }
    const tier = showcaseNavTier(entry);
    const families = byTier.get(tier) ?? new Map<string, FigmaComponentEntry[]>();
    const list = families.get(family) ?? [];
    list.push(entry);
    families.set(family, list);
    byTier.set(tier, families);
  }

  return TIER_ORDER.filter((tier) => byTier.has(tier)).map((tier) => {
    const families = byTier.get(tier)!;
    const familyNavs = [...families.entries()]
      .map(([family, entries]) => {
        const sorted = entries.slice().sort((a, b) => a.exportName.localeCompare(b.exportName));
        const directorySlug = sorted.find((entry) => SHOWCASE_NAV_PROMOTE_BY_SLUG[entry.slug])?.slug;
        return {
          tier,
          family,
          label: FAMILY_LABELS[family] ?? family,
          directory: familyDirectory(tier, family, directorySlug),
          entries: sorted,
          implementedCount: sorted.filter(isShowcaseEntryImplemented).length,
          bodySlug: resolveBodySlug(family),
          galleryFamily: GALLERY_FAMILIES[family],
          showcaseInfra: family === 'glass' || family === 'scroll-edge',
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

/**
 * Molecules 二级列表 · 组标题与族顺序（仅 Showcase 分区/排序；每项仍是独立族与独立 Live）。
 * 不构成组合组件、共享 API 或族索引页。
 */
export const MOLECULES_TIER_SECTION_OUTPUT = '输出';
export const MOLECULES_TIER_SECTION_INPUT = '输入';
export const MOLECULES_TIER_SECTION_FEEDBACK = '反馈';
export const MOLECULES_TIER_SECTION_TAG = '标记';
export const MOLECULES_TIER_SECTION_TOGGLE = '切换';
export const MOLECULES_TIER_SECTION_CHOICE = '选择';

/** 顺序：输入 → 输出 → 反馈 → 标记 → 切换 → 选择 */
export const MOLECULES_TIER_SECTIONED_FAMILIES: Record<string, readonly string[]> = {
  [MOLECULES_TIER_SECTION_INPUT]: ['input', 'search', 'textarea'],
  [MOLECULES_TIER_SECTION_OUTPUT]: ['button', 'glass-button', 'symbol-button', 'link'],
  [MOLECULES_TIER_SECTION_FEEDBACK]: [
    'toast',
    'form-submission',
    'status-card',
    'reddot',
    'message',
    'streamer',
  ],
  [MOLECULES_TIER_SECTION_TAG]: ['tag', 'locate'],
  [MOLECULES_TIER_SECTION_TOGGLE]: ['switch', 'segmented-control', 'toggle-block', 'tab'],
  [MOLECULES_TIER_SECTION_CHOICE]: ['radio', 'checkbox', 'decide'],
};

export function buildTierFamilySections(
  tierNav: ComponentTierNav,
): Array<{ title?: string; families: ComponentFamilyNav[] }> {
  if (tierNav.tier !== 'molecules') {
    return [{ families: tierNav.families }];
  }

  const grouped = new Set(Object.values(MOLECULES_TIER_SECTIONED_FAMILIES).flat());
  const sections: Array<{ title?: string; families: ComponentFamilyNav[] }> = [];

  for (const [title, familyKeys] of Object.entries(MOLECULES_TIER_SECTIONED_FAMILIES)) {
    const families = familyKeys
      .map((key) => tierNav.families.find((item) => item.family === key))
      .filter((item): item is ComponentFamilyNav => item != null);
    if (families.length > 0) {
      sections.push({ title, families });
    }
  }

  const rest = tierNav.families.filter((item) => !grouped.has(item.family));
  if (rest.length > 0) {
    sections.push({ families: rest });
  }

  return sections.length > 0 ? sections : [{ families: tierNav.families }];
}

const FAMILY_EG_EXPORT_OVERRIDES: Record<string, string> = {
  button: 'EgButton',
  'glass-button': 'EgGlassCapsule',
  'symbol-button': 'EgSymbolAction',
  link: 'EgLink',
  search: 'EgSearch',
  textarea: 'EgTextarea',
  toast: 'EgToast',
  'form-submission': 'EgFormSubmission',
  'status-card': 'EgStatusCard',
  reddot: 'EgReddot',
  message: 'EgMessage',
  streamer: 'EgStreamer',
  tag: 'EgTag',
  switch: 'EgSwitch',
  checkbox: 'EgCheckbox',
  radio: 'EgRadio',
  decide: 'EgDecide',
  'toggle-block': 'EgToggle',
  menu: 'EgMenu',
  tab: 'EgTab',
  'segmented-control': 'EgSegmentedControl',
  'scroll-edge': 'EgScrollEdgeEffect',
};

/** 族级组件名 — `Eg` + PascalCase(family)，Tier / 族页标题与列表统一。 */
export function familyEgComponentName(family: string): string {
  if (FAMILY_EG_EXPORT_OVERRIDES[family]) {
    return FAMILY_EG_EXPORT_OVERRIDES[family];
  }
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

const FAMILY_TIER_ROW_HINT_OVERRIDES: Record<string, string> = {
  avatar: '头像',
  button: '按钮',
  divider: '分割线',
  toast: '吐司',
  'form-submission': '注释',
  'status-card': '状态卡',
  reddot: '红点',
  message: '信息提示',
  streamer: '横幅',
  glass: '容器材质',
  input: '文本输入',
  search: '搜索框',
  textarea: '文本域',
  popovers: '浮层',
  'scroll-edge': '遮罩',
  tag: '标签',
  locate: '定位',
  switch: '开关',
  'segmented-control': '分段控制器',
  radio: '单选',
  checkbox: '复选',
  decide: '勾选',
  'toggle-block': '胶囊切换',
  symbol: '图形解析器、含Icon与Crypto',
  link: '文字链接',
  'glass-button': '玻璃胶囊',
  'symbol-button': '符号圆钮',
  menu: '触发与下拉',
  'nav-bar': '导航栏',
  sheets: '悬浮层',
  'tab-bar': '标签栏',
  tab: '标签切换',
};

export function familyTierRowHint(nav: ComponentFamilyNav): string {
  const override = FAMILY_TIER_ROW_HINT_OVERRIDES[nav.family];
  if (override) {
    return override;
  }
  if (nav.family === 'item') {
    return '个人中心 / 设置分组行 · value · chevron · 分割线';
  }
  if (nav.family === 'page') {
    return '常规页面';
  }
  if (nav.family === 'page-shot') {
    return '弹窗页面';
  }
  return nav.label;
}

/** 族列表直进 Live · 无族索引页。 */
const FAMILY_TIER_DIRECT_DETAIL_SLUG: Partial<Record<string, string>> = {
  glass: 'glass-eg',
  'scroll-edge': 'glass-scroll-edge',
  'nav-bar': 'tab-bar-nav-bar',
  'segmented-control': 'tab-segmented-control',
  button: 'button-body',
  'glass-button': 'button-glass',
  'symbol-button': 'button-icon-container',
  link: 'link-body',
  input: 'input-body',
  search: 'search-body',
  textarea: 'textarea-body',
  toast: 'feedback-toast',
  'form-submission': 'feedback-form-submission',
  'status-card': 'feedback-status-card',
  reddot: 'feedback-reddot',
  message: 'feedback-message',
  streamer: 'feedback-streamer',
  tag: 'tag-color',
  locate: 'locate',
  switch: 'toggle-switch',
  checkbox: 'toggle-checkbox',
  radio: 'toggle-radio',
  decide: 'toggle-decide',
  'toggle-block': 'tab-block',
  tab: 'tab-tabs',
};

export function familyTierPressHref(
  nav: ComponentFamilyNav,
): `/(components)/family/${string}/${string}` | `/(components)/detail/${string}` {
  const directSlug = FAMILY_TIER_DIRECT_DETAIL_SLUG[nav.family];
  if (directSlug) {
    return `/(components)/detail/${directSlug}`;
  }
  return `/(components)/family/${nav.tier}/${nav.family}`;
}
