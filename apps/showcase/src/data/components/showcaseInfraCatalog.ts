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
    figmaName: 'EgTabBlock',
    showcaseLabel: '胶囊横滚 · 计数红点 · 正文 layout-content',
    exportName: 'EgTabBlock',
    tier: 'molecules',
    family: 'tab',
    slug: 'tab-block',
    figmaPage: INFRA_PAGE,
    kind: 'component',
  },
  {
    figmaName: 'TabBar Text',
    showcaseLabel: '纯文本 Tab · Body Small Heavy · 无 icon',
    exportName: 'EgTabBarText',
    tier: 'organisms',
    family: 'tab-bar',
    slug: SHOWCASE_TAB_BAR_TEXT_SLUG,
    figmaPage: INFRA_PAGE,
    kind: 'component',
  },
];

export const SHOWCASE_INFRA_SLUGS = new Set(SHOWCASE_INFRA_CATALOG.map((entry) => entry.slug));

export function isShowcaseInfraSlug(slug: string): boolean {
  return SHOWCASE_INFRA_SLUGS.has(slug);
}
