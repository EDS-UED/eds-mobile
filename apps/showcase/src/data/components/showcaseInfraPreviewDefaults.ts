import {
  defaultBlurGlassCustomizeState,
  defaultScrollEdgeCustomizeState,
} from '@/data/tokens/glassEffectCustomizeModel';
import {
  SHOWCASE_GLASS_EG_SLUG,
  SHOWCASE_PAGE_BODY_SLUG,
  SHOWCASE_SCROLL_EDGE_EG_SLUG,
} from '@/data/components/showcaseInfraCatalog';
import { pageBodyCustomizeDefaults } from '@/data/components/pageBodyCustomizeModel';

export function showcaseInfraPreviewDefaults(slug: string): Record<string, unknown> | undefined {
  if (slug === SHOWCASE_GLASS_EG_SLUG) {
    return defaultBlurGlassCustomizeState();
  }
  if (slug === SHOWCASE_SCROLL_EDGE_EG_SLUG) {
    return defaultScrollEdgeCustomizeState();
  }
  return undefined;
}
