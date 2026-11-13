import type { FigmaComponentEntry } from '@eds/mobile-components/catalog';

/** Showcase 真源：不来自 Figma 202 清单的基础设施 / 跨场景 API。 */
export type ShowcaseInfraEntry = FigmaComponentEntry & {
  /** 在族列表与详情 meta 中展示的实现说明。 */
  showcaseLabel: string;
};

const INFRA_PAGE = 'EDS Showcase';

/** Glass 族唯一详情入口 — 跳过族列表页。 */
export const SHOWCASE_GLASS_EG_SLUG = 'glass-eg';

/** Icon/Crypto 运行时入口 — Atoms · `atoms/_shared/symbol`。 */
export const SHOWCASE_SYMBOL_BODY_SLUG = 'symbol-body';

export const SHOWCASE_MENU_BODY_SLUG = 'menu-body';

export const SHOWCASE_SHEETS_BODY_SLUG = 'sheets-body';

export const SHOWCASE_INFRA_CATALOG: ShowcaseInfraEntry[] = [
  {
    figmaName: 'EgGlass',
    showcaseLabel: '容器玻璃材质',
    exportName: 'ShowcaseEgGlassPreview',
    tier: 'atoms',
    family: 'glass',
    slug: SHOWCASE_GLASS_EG_SLUG,
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
];

export const SHOWCASE_INFRA_SLUGS = new Set(SHOWCASE_INFRA_CATALOG.map((entry) => entry.slug));

export function isShowcaseInfraSlug(slug: string): boolean {
  return SHOWCASE_INFRA_SLUGS.has(slug);
}
