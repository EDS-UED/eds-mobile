import type { CatalogSection } from '../types';

export type AnimationCatalogMeta = {
  slug: string;
  name: string;
  description: string;
};

export const animationCatalogMeta: AnimationCatalogMeta[] = [
  {
    slug: 'ios-spring-default',
    name: 'iOS Spring Default',
    description: 'Modal / sheet 默认 spring（Reanimated withSpring）',
  },
  {
    slug: 'ios-spring-snappy',
    name: 'iOS Spring Snappy',
    description: 'Button press / toggle',
  },
  {
    slug: 'ios-navigation-push',
    name: 'iOS Navigation Push',
    description: 'Navigation push 时序曲线',
  },
  {
    slug: 'ios-ease-in-out',
    name: 'iOS Ease In Out',
    description: 'UIView 标准 ease-in-out',
  },
];

export const animationsCatalog: CatalogSection[] = [
  {
    title: 'Animations',
    items: animationCatalogMeta.map((entry) => ({
      name: entry.name,
      slug: entry.slug,
      description: entry.description,
      status: 'implemented' as const,
    })),
  },
];

export const defaultAnimationSlug = animationCatalogMeta[0].slug;

export function findAnimationMeta(slug: string): AnimationCatalogMeta | undefined {
  return animationCatalogMeta.find((entry) => entry.slug === slug);
}

export function isValidAnimationSlug(slug: string): boolean {
  return findAnimationMeta(slug) !== undefined;
}
