import type { FigmaComponentEntry } from '@eds/mobile-components/catalog';

/** Showcase 真源：不来自 Figma 202 清单的基础设施 / 跨场景 API。 */
export type ShowcaseInfraEntry = FigmaComponentEntry & {
  /** 在族列表与详情 meta 中展示的实现说明。 */
  showcaseLabel: string;
};

const INFRA_PAGE = 'EDS Showcase';

export const SHOWCASE_GLASS_EG_SLUG = 'glass-eg';
export const SHOWCASE_SCROLL_EDGE_EG_SLUG = 'glass-scroll-edge';

/** Icon/Crypto 运行时入口 — Atoms · `atoms/_shared/symbol`。 */
export const SHOWCASE_SYMBOL_BODY_SLUG = 'symbol-body';

export const SHOWCASE_MENU_BODY_SLUG = 'menu-body';

export const SHOWCASE_SHEETS_BODY_SLUG = 'sheets-body';

export const SHOWCASE_DATA_LIST_BODY_SLUG = 'data-list-body';

export const SHOWCASE_ITEM_BODY_SLUG = 'item-body';

export const SHOWCASE_TAB_BAR_TEXT_SLUG = 'tab-bar-text';

export const SHOWCASE_LINK_BODY_SLUG = 'link-body';

export const SHOWCASE_BUTTON_BODY_SLUG = 'button-body';

export const SHOWCASE_INPUT_BODY_SLUG = 'input-body';

export const SHOWCASE_SEARCH_BODY_SLUG = 'search-body';

export const SHOWCASE_TEXTAREA_BODY_SLUG = 'textarea-body';

export const SHOWCASE_GLASS_BUTTON_BODY_SLUG = 'glass-button-body';

export const SHOWCASE_SYMBOL_BUTTON_BODY_SLUG = 'symbol-button-body';

export const SHOWCASE_PAGE_BODY_SLUG = 'page-body';
export const SHOWCASE_PAGE_SHOT_BODY_SLUG = 'page-shot-body';

export const SHOWCASE_INFRA_CATALOG: ShowcaseInfraEntry[] = [
  {
    figmaName: 'EgGlass',
    showcaseLabel: 'BlurGlass · Effect Glass Box',
    exportName: 'ShowcaseEgGlassPreview',
    tier: 'atoms',
    family: 'glass',
    slug: SHOWCASE_GLASS_EG_SLUG,
    figmaPage: INFRA_PAGE,
    kind: 'component',
  },
  {
    figmaName: 'EgScrollEdgeEffect',
    showcaseLabel: 'Scroll Edge · glass-mask-box',
    exportName: 'ShowcaseEgScrollEdgePreview',
    tier: 'atoms',
    family: 'scroll-edge',
    slug: SHOWCASE_SCROLL_EDGE_EG_SLUG,
    figmaPage: INFRA_PAGE,
    kind: 'component',
  },
  {
    figmaName: 'Menu',
    showcaseLabel: 'Menu 本体 · iOS 26+ 系统 Menu / 其它 RN 浮层',
    exportName: 'EgMenu',
    tier: 'organisms',
    family: 'menu',
    slug: SHOWCASE_MENU_BODY_SLUG,
    figmaPage: INFRA_PAGE,
    kind: 'component',
  },
  {
    figmaName: 'Sheets',
    showcaseLabel: 'Sheets · 底部浮层（悬浮档 ↔ 大尺寸贴边）',
    exportName: 'EgSheets',
    tier: 'organisms',
    family: 'sheets',
    slug: SHOWCASE_SHEETS_BODY_SLUG,
    figmaPage: INFRA_PAGE,
    kind: 'component',
  },
  {
    figmaName: 'EgSymbol',
    showcaseLabel: 'Icon/Crypto 统一渲染（name → SVG 资产）',
    exportName: 'EgSymbol',
    tier: 'atoms',
    family: 'symbol',
    slug: SHOWCASE_SYMBOL_BODY_SLUG,
    figmaPage: INFRA_PAGE,
    kind: 'component',
  },
  {
    figmaName: 'Data List',
    showcaseLabel: '数据列表 · DL-bleed + EgDataListRow 行壳',
    exportName: 'EgDataList',
    tier: 'organisms',
    family: 'data-list',
    slug: SHOWCASE_DATA_LIST_BODY_SLUG,
    figmaPage: INFRA_PAGE,
    kind: 'component',
  },
  {
    figmaName: 'Item',
    showcaseLabel: '设置行 · 图形 + 主文案 + value / chevron',
    exportName: 'EgItem',
    tier: 'organisms',
    family: 'item',
    slug: SHOWCASE_ITEM_BODY_SLUG,
    figmaPage: INFRA_PAGE,
    kind: 'component',
  },
  {
    figmaName: 'EgToggle',
    showcaseLabel: '胶囊横滚 · 计数红点 · 正文 layout-content',
    exportName: 'EgToggle',
    tier: 'molecules',
    family: 'toggle-block',
    slug: 'tab-block',
    figmaPage: INFRA_PAGE,
    kind: 'component',
  },
  {
    figmaName: 'EgButton',
    showcaseLabel: 'Button',
    exportName: 'EgButton',
    tier: 'molecules',
    family: 'button',
    slug: SHOWCASE_BUTTON_BODY_SLUG,
    figmaPage: INFRA_PAGE,
    kind: 'component',
  },
  {
    figmaName: 'EgInput',
    showcaseLabel: 'Input',
    exportName: 'EgInput',
    tier: 'molecules',
    family: 'input',
    slug: SHOWCASE_INPUT_BODY_SLUG,
    figmaPage: INFRA_PAGE,
    kind: 'component',
  },
  {
    figmaName: 'EgSearch',
    showcaseLabel: 'Search',
    exportName: 'EgSearch',
    tier: 'molecules',
    family: 'search',
    slug: SHOWCASE_SEARCH_BODY_SLUG,
    figmaPage: INFRA_PAGE,
    kind: 'component',
  },
  {
    figmaName: 'EgTextarea',
    showcaseLabel: 'Textarea',
    exportName: 'EgTextarea',
    tier: 'molecules',
    family: 'textarea',
    slug: SHOWCASE_TEXTAREA_BODY_SLUG,
    figmaPage: INFRA_PAGE,
    kind: 'component',
  },
  {
    figmaName: 'EgLink',
    showcaseLabel: 'Link',
    exportName: 'EgLink',
    tier: 'molecules',
    family: 'link',
    slug: SHOWCASE_LINK_BODY_SLUG,
    figmaPage: INFRA_PAGE,
    kind: 'component',
  },
  {
    figmaName: 'EgGlassCapsule',
    showcaseLabel: 'Glass Button',
    exportName: 'EgGlassCapsule',
    tier: 'molecules',
    family: 'glass-button',
    slug: SHOWCASE_GLASS_BUTTON_BODY_SLUG,
    figmaPage: INFRA_PAGE,
    kind: 'component',
  },
  {
    figmaName: 'EgSymbolAction',
    showcaseLabel: 'Symbol Button',
    exportName: 'EgSymbolAction',
    tier: 'molecules',
    family: 'symbol-button',
    slug: SHOWCASE_SYMBOL_BUTTON_BODY_SLUG,
    figmaPage: INFRA_PAGE,
    kind: 'component',
  },
  {
    figmaName: 'EgTabBarText',
    showcaseLabel: '纯文本 Tab · Body Small Heavy · 无 icon',
    exportName: 'EgTabBarText',
    tier: 'organisms',
    family: 'tab-bar',
    slug: SHOWCASE_TAB_BAR_TEXT_SLUG,
    figmaPage: INFRA_PAGE,
    kind: 'component',
  },
  {
    figmaName: 'EgPage',
    showcaseLabel: '页面本体 · spacing-5 边距 · motion-page',
    exportName: 'EgPage',
    tier: 'templates',
    family: 'page',
    slug: SHOWCASE_PAGE_BODY_SLUG,
    figmaPage: INFRA_PAGE,
    kind: 'component',
  },
  {
    figmaName: 'EgPageShot',
    showcaseLabel: '弹层页面 · motion-page-shot',
    exportName: 'EgPageShot',
    tier: 'templates',
    family: 'page-shot',
    slug: SHOWCASE_PAGE_SHOT_BODY_SLUG,
    figmaPage: INFRA_PAGE,
    kind: 'component',
  },
];

export const SHOWCASE_INFRA_SLUGS = new Set(SHOWCASE_INFRA_CATALOG.map((entry) => entry.slug));

export function isShowcaseInfraSlug(slug: string): boolean {
  return SHOWCASE_INFRA_SLUGS.has(slug);
}
