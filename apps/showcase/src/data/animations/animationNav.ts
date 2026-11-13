import motionCatalog from '@eds/mobile-tokens/motion/catalog';

export type MotionCatalogEntry = {
  id: string;
  recipe?: string;
  cssRecipe: string | null;
  springRef: string | null;
  timingRef: string | null;
  hapticRef: string | null;
};

export type AnimationDemoLink = {
  id: string;
  label: string;
  lead: string;
  route: 'MotionDemo' | 'GlassDemo';
};

export const animationDemos: AnimationDemoLink[] = [
  {
    id: 'motion-demo',
    label: 'Motion 演示',
    lead: '封装图形动画 · spring · reduced motion',
    route: 'MotionDemo',
  },
  {
    id: 'liquid-glass',
    label: '液态玻璃',
    lead: 'Callstack Liquid Glass · RN 对照',
    route: 'GlassDemo',
  },
];

export const motionCatalogEntries: MotionCatalogEntry[] = Object.entries(
  motionCatalog.resolution as Record<string, Omit<MotionCatalogEntry, 'id'>>,
)
  .map(([id, value]) => ({ id, ...value }))
  .sort((a, b) => a.id.localeCompare(b.id));

export function formatMotionCatalogHint(entry: MotionCatalogEntry) {
  const recipe = entry.recipe ?? '—';
  const cssRecipe = entry.cssRecipe ?? '—';
  return `recipe: ${recipe} · ${cssRecipe}`;
}

export const motionArchitectureNote = motionCatalog.note as string;
export const motionArchitecture = motionCatalog.architecture as string;
