import type { CatalogChildItem, CatalogItem, CatalogSection } from '../types';
import { componentCatalog } from './catalog';

export type CatalogItemLocation = {
  section: CatalogSection;
  item: CatalogItem;
};

export type CatalogChildPageLocation = {
  parent: CatalogItemLocation;
  child: CatalogChildItem;
};

export const defaultComponentSlug = 'icons';

export function getCatalogChildPageSlug(child: CatalogChildItem): string {
  return child.pageSlug ?? child.id;
}

export function findCatalogChildPage(slug: string): CatalogChildPageLocation | undefined {
  for (const parent of iterCatalogItems()) {
    for (const child of parent.item.children ?? []) {
      if (getCatalogChildPageSlug(child) === slug) {
        return { parent, child };
      }
    }
  }
  return undefined;
}

export function getCatalogChildLabel(slug: string, childId: string): string | undefined {
  const entry = findCatalogItem(slug);
  return entry?.item.children?.find((child) => child.id === childId)?.label;
}

export function getCatalogChildAnchorIds(slug: string): string[] {
  const entry = findCatalogItem(slug);
  return entry?.item.children?.map((child) => child.id) ?? [];
}

/** Hash section ids for a standalone component page (body + `navParent` scenes). */
export function getCatalogPageAnchorIds(pageSlug: string): string[] {
  for (const { item } of iterCatalogItems()) {
    const children = item.children ?? [];
    const body = children.find(
      (child) => child.standalonePage && getCatalogChildPageSlug(child) === pageSlug,
    );
    if (!body) continue;

    const sceneIds = children
      .filter((child) => child.navParent === pageSlug)
      .map((child) => child.id);

    return [body.id, ...sceneIds];
  }

  return [];
}

export function getComponentRouteSlug(path: string, paramSlug: unknown): string {
  if (typeof paramSlug === 'string' && paramSlug.length > 0) {
    return paramSlug;
  }
  const match = path.match(/^\/components\/([^/#?]+)/);
  return match?.[1] ?? '';
}

export function moleculeUsesChildPages(item: CatalogItem): boolean {
  return (item.children ?? []).some((child) => child.standalonePage);
}

export function getMoleculeLandingPageSlug(item: CatalogItem): string {
  const body = item.children?.find(
    (child) =>
      child.standalonePage &&
      !child.navParent &&
      !child.navSection &&
      !child.navSubgroup,
  );
  if (body) return getCatalogChildPageSlug(body);

  const firstPage = item.children?.find((child) => child.standalonePage);
  if (firstPage) return getCatalogChildPageSlug(firstPage);

  return item.slug;
}

export function iterCatalogItems(
  catalog: CatalogSection[] = componentCatalog,
): CatalogItemLocation[] {
  const entries: CatalogItemLocation[] = [];

  for (const section of catalog) {
    if (section.groups) {
      for (const group of section.groups) {
        for (const item of group.items) {
          entries.push({ section, item });
        }
      }
    }

    for (const item of section.items) {
      entries.push({ section, item });
    }
  }

  return entries;
}

export function getCatalogChildExportName(slug: string): string | undefined {
  const page = findCatalogChildPage(slug);
  return page?.child.exportName;
}

export function findCatalogItem(slug: string): CatalogItemLocation | undefined {
  return iterCatalogItems().find((entry) => entry.item.slug === slug);
}

export function isValidComponentSlug(slug: string): boolean {
  if (findCatalogItem(slug)) return true;
  return findCatalogChildPage(slug) !== undefined;
}
