import type { GlassBoxClassName } from '@eds/mobile-components';

const SLUG_GLASS_BOX: Record<string, GlassBoxClassName> = {
  'glass-eg': 'glass-button-box',
};

export function showcaseInfraPreviewDefaults(slug: string): Record<string, unknown> | undefined {
  const box = SLUG_GLASS_BOX[slug];
  if (!box) {
    return undefined;
  }
  return { box };
}
