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

export type ShowcaseCatalogEntry = FigmaComponentEntry | ShowcaseInfraEntry;

export function isShowcaseInfraEntry(
  entry: ShowcaseCatalogEntry,
): entry is ShowcaseInfraEntry {
  return isShowcaseInfraSlug(entry.slug);
}

/** Figma catalog + showcase 基础设施（族导航与详情真源）。 */
export function getShowcaseComponentCatalog(): ShowcaseCatalogEntry[] {
  return [...figmaComponentCatalog, ...SHOWCASE_INFRA_CATALOG];
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
