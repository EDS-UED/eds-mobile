import type { CatalogTokensSection } from '@/views/tokens/CatalogTokensView';

import { getEffectBaseGroups, getEffectSemanticGroups, getEffectTokenByName } from './effectTokenCatalog';
import {
  getMotionBaseGroups,
  getMotionRecipeGroups,
  getMotionSemanticGroups,
  getMotionTokenByName,
} from './motionTokenCatalog';
import { getScaleBaseEntries, getScaleSemanticGroups, getScaleTokenByName } from './scaleTokenCatalog';
import { MOTION_SHOWCASE_SECTION_TITLES, SCALE_BASE_SHOWCASE } from './showcaseTokenGroupComments';
import type { TokenEntry } from './tokenCatalogTypes';
import { getTypographyTokenByName } from './typographyTokenCatalog';

export type TokenCategoryConfig = {
  id: string;
  label: string;
  lead: string;
  specPath: string;
  routeId: string;
  getSections: () => CatalogTokensSection[];
  resolveToken: (name: string) => TokenEntry | undefined;
};

export const tokenCategoryRegistry: TokenCategoryConfig[] = [
  {
    id: 'scale',
    label: 'Scale',
    lead: 'Base & Semantic',
    specPath: 'packages/tokens/spec/scale',
    routeId: 'scale',
    getSections: () => [
      {
        title: 'Base',
        variant: 'rows',
        groups: (() => {
          const baseEntries = getScaleBaseEntries();
          return [
            {
              comment: SCALE_BASE_SHOWCASE.primitive,
              tokens: baseEntries.filter((entry) => entry.name === 'scale-base'),
            },
            {
              comment: SCALE_BASE_SHOWCASE.engine,
              tokens: baseEntries.filter((entry) => entry.name !== 'scale-base'),
            },
          ];
        })(),
      },
      { title: 'Semantic', variant: 'rows', groups: getScaleSemanticGroups() },
    ],
    resolveToken: getScaleTokenByName,
  },
  {
    id: 'typography',
    label: 'Typography',
    lead: 'TextStyle · Family · Base',
    specPath: 'packages/tokens/spec/typography',
    routeId: 'typography',
    getSections: () => [],
    resolveToken: getTypographyTokenByName,
  },
  {
    id: 'effect',
    label: 'Effect',
    lead: 'Base & Semantic',
    specPath: 'packages/tokens/spec/effect',
    routeId: 'effect',
    getSections: () => [
      { title: 'Base', variant: 'rows', groups: getEffectBaseGroups() },
      { title: 'Semantic', variant: 'rows', groups: getEffectSemanticGroups() },
    ],
    resolveToken: getEffectTokenByName,
  },
  {
    id: 'liquid-glass',
    label: 'Liquid Glass',
    lead: '默认、增强与回退',
    specPath: 'packages/tokens/spec/liquid-glass',
    routeId: 'liquid-glass',
    getSections: () => [],
    resolveToken: () => undefined,
  },
  {
    id: 'motion',
    label: 'Animas',
    lead: 'Base · Recipe · Semantic',
    specPath: 'packages/tokens/spec/motion',
    routeId: 'motion',
    getSections: () => [
      { title: MOTION_SHOWCASE_SECTION_TITLES.base, variant: 'rows', groups: getMotionBaseGroups() },
      { title: MOTION_SHOWCASE_SECTION_TITLES.recipe, variant: 'rows', groups: getMotionRecipeGroups() },
      { title: MOTION_SHOWCASE_SECTION_TITLES.semantic, variant: 'rows', groups: getMotionSemanticGroups() },
    ],
    resolveToken: getMotionTokenByName,
  },
];

export function getTokenCategoryConfig(categoryId: string) {
  return tokenCategoryRegistry.find((category) => category.id === categoryId);
}

export function resolveCatalogToken(categoryId: string, name: string) {
  return getTokenCategoryConfig(categoryId)?.resolveToken(name);
}
