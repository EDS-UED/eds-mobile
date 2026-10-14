import type { FigmaComponentEntry } from '@eds/mobile-components/catalog';

/** Showcase 真源：不来自 Figma 202 清单的基础设施 / 跨场景 API。 */
export type ShowcaseInfraEntry = FigmaComponentEntry & {
  /** 在族列表与详情 meta 中展示的实现说明。 */
  showcaseLabel: string;
};

const INFRA_PAGE = 'EDS Showcase';

/** Glass 族唯一详情入口 — 跳过族列表页。 */
export const SHOWCASE_GLASS_EG_SLUG = 'glass-eg';

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
];

export const SHOWCASE_INFRA_SLUGS = new Set(SHOWCASE_INFRA_CATALOG.map((entry) => entry.slug));

export function isShowcaseInfraSlug(slug: string): boolean {
  return SHOWCASE_INFRA_SLUGS.has(slug);
}
