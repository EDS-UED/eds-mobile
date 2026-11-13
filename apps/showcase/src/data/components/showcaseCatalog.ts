import {
  figmaComponentCatalog,
  isImplementedCatalogEntry,
  type FigmaComponentEntry,
} from '@eds/mobile-components/catalog';

import {
  isShowcaseInfraSlug,
  SHOWCASE_INFRA_CATALOG,
  type ShowcaseInfraEntry,
} from './showcaseInfraCatalog.js';

/** Showcase 不展示 — catalog 仍保留 Figma 对齐项。 */
const SHOWCASE_EXCLUDED_CATALOG_SLUGS = new Set(['tab-base-tab']);

export type ShowcaseCatalogEntry = FigmaComponentEntry | ShowcaseInfraEntry;

export function isShowcaseInfraEntry(
  entry: ShowcaseCatalogEntry,
): entry is ShowcaseInfraEntry {
  return isShowcaseInfraSlug(entry.slug);
}

/** Figma catalog + showcase 基础设施（族导航与详情真源）。 */
export function getShowcaseComponentCatalog(): ShowcaseCatalogEntry[] {
  return [...figmaComponentCatalog, ...SHOWCASE_INFRA_CATALOG].filter(
    (entry) => !SHOWCASE_EXCLUDED_CATALOG_SLUGS.has(entry.slug),
  );
}

export function findShowcaseCatalogEntry(slugOrExport: string): ShowcaseCatalogEntry | undefined {
  const catalog = getShowcaseComponentCatalog();
  return (
    catalog.find((entry) => entry.slug === slugOrExport) ??
    catalog.find((entry) => entry.exportName === slugOrExport)
  );
}

export function isShowcaseEntryImplemented(entry: Pick<ShowcaseCatalogEntry, 'slug'>): boolean {
  if (isShowcaseInfraSlug(entry.slug)) {
    return true;
  }
  return isImplementedCatalogEntry(entry);
}
