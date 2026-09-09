import {
  CATALOG_NAV_ROLE_GROUP_LABELS,
  resolveCatalogChildNavRole,
} from './catalogNavRole';
import type { AnchorItem, CatalogChildItem, CatalogItem, CatalogSection } from './types';
import { catalogSectionId } from './catalogSectionId';

export type CatalogChildPageSlugResolver = (child: CatalogChildItem) => string;

function catalogDepth(value: number): AnchorItem['depth'] {
  return value as AnchorItem['depth'];
}

function appendFamilyChildren(
  items: AnchorItem[],
  family: CatalogItem,
  familyDepth: number,
  resolveChildPageSlug?: CatalogChildPageSlugResolver,
) {
  let activeNavGroup: ReturnType<typeof resolveCatalogChildNavRole> | null = null;

  for (const child of family.children ?? []) {
    if (child.navSubgroup) {
      activeNavGroup = null;
      items.push({
        id: `${family.slug}:${child.id}`,
        label: child.label,
        depth: catalogDepth(familyDepth + 1),
        kind: 'navSubgroup',
      });
      continue;
    }

    if (child.navSection) {
      activeNavGroup = null;
      items.push({
        id: `${family.slug}:${child.id}`,
        label: child.label,
        depth: catalogDepth(familyDepth + 1),
        kind: 'navSection',
      });
      continue;
    }

    const navRole = resolveCatalogChildNavRole(child.navRole);

    if (navRole === 'standard') {
      activeNavGroup = null;
    } else if (!child.navParent && navRole !== activeNavGroup) {
      items.push({
        id: `${family.slug}:nav-group:${navRole}:${child.id}`,
        label: CATALOG_NAV_ROLE_GROUP_LABELS[navRole],
        depth: catalogDepth(familyDepth + 1),
        kind: 'navGroup',
      });
      activeNavGroup = navRole;
    }

    if (!child.standalonePage) continue;

    const linkDepth = child.navParent ? familyDepth + 2 : familyDepth + 1;

    items.push({
      id: `${family.slug}:${child.id}`,
      label: child.label,
      depth: catalogDepth(linkDepth),
      parentSlug: family.slug,
      anchorId: child.id,
      pageSlug: resolveChildPageSlug?.(child) ?? child.pageSlug ?? child.id,
      standalonePage: true,
      ...(child.navParent ? { navParent: child.navParent } : {}),
      ...(child.hideSidebarBody ? { hideSidebarBody: true } : {}),
    });
  }
}

function appendFamilies(
  items: AnchorItem[],
  families: CatalogItem[],
  familyDepth: number,
  resolveChildPageSlug?: CatalogChildPageSlugResolver,
) {
  for (const family of families) {
    items.push({
      id: family.slug,
      label: family.name,
      depth: catalogDepth(familyDepth),
    });

    appendFamilyChildren(items, family, familyDepth, resolveChildPageSlug);
  }
}

export function buildCatalogAnchorItems(
  catalog: CatalogSection[],
  resolveChildPageSlug?: CatalogChildPageSlugResolver,
): AnchorItem[] {
  const items: AnchorItem[] = [];

  for (const section of catalog) {
    items.push({
      id: catalogSectionId(section.title),
      label: section.title,
      depth: catalogDepth(1),
    });

    if (section.groups?.length) {
      for (const group of section.groups) {
        items.push({
          id: `${catalogSectionId(section.title)}:${group.title}`,
          label: group.title,
          depth: catalogDepth(2),
          kind: 'navGroup',
        });

        appendFamilies(items, group.items, 3, resolveChildPageSlug);
      }
    }

    if (section.items.length) {
      appendFamilies(items, section.items, 2, resolveChildPageSlug);
    }
  }

  return items;
}
