import { tokenCategoryRegistry, type TokenCategoryConfig } from './tokenCategoryRegistry';

export type TokenCategory = Pick<
  TokenCategoryConfig,
  'id' | 'label' | 'lead' | 'specPath' | 'routeId'
>;

/** Token IA — Color + registry-driven categories. */
export const tokenCategories: TokenCategory[] = [
  {
    id: 'color',
    label: 'Color',
    lead: 'Base & Semantic',
    specPath: 'packages/tokens/spec/color',
    routeId: 'color',
  },
  ...tokenCategoryRegistry.map(({ id, label, lead, specPath, routeId }) => ({
    id,
    label,
    lead,
    specPath,
    routeId,
  })),
];
