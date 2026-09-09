export type CatalogChildNavRole = 'standard' | 'variant' | 'scenes' | 'combo';

export type CatalogChildItem = {
  id: string;
  label: string;
  /** Showcase sidebar group — navigation only; does not affect routes or component API. */
  navRole?: CatalogChildNavRole;
  /** Sidebar section row (e.g. Scenes) at same indent as body links; not a route. */
  navSection?: boolean;
  /** Flotation product line label (Trigger / Box / Combo); not a route. */
  navSubgroup?: boolean;
  /** Groups scene pages under a `navSection` id in the sidebar. */
  navParent?: string;
  /** Empty Scenes row — routable placeholder（`场景化拓展中...`）。 */
  emptyScenesPlaceholder?: boolean;
  /** Standalone showcase route slug (defaults to `id`). */
  pageSlug?: string;
  /** RN / Vue export — Eg* scene component name; aligns with route slug. */
  exportName?: string;
  /** When true, child has its own `/components/:pageSlug` route (not in-page hash). */
  standalonePage?: boolean;
  /** Body duplicates family nav — sidebar uses the family row only (business presets). */
  hideSidebarBody?: boolean;
};

export type CatalogItem = {
  name: string;
  slug: string;
  description: string;
  status?: 'implemented' | 'placeholder';
  children?: CatalogChildItem[];
};

export type CatalogSection = {
  title: string;
  items: CatalogItem[];
  groups?: Array<{ title: string; items: CatalogItem[] }>;
};

export type AnchorItem = {
  id: string;
  label: string;
  depth?: 1 | 2 | 3 | 4 | 5;
  /** Auto-inserted group label (Variants / Scenes / Combo) or organ subgroup (Navigation). */
  kind?: 'navGroup' | 'navSection' | 'navSubgroup';
  parentSlug?: string;
  anchorId?: string;
  /** Route slug when child is a standalone component page. */
  pageSlug?: string;
  standalonePage?: boolean;
  /** Scene child under Scenes / Slot — drives sceneBranch grouping. */
  navParent?: string;
  hideSidebarBody?: boolean;
};

export type ScaleSemanticGroup = {
  title: string;
  match: (name: string) => boolean;
};
