import {
  resolveGlassBoxComposition,
  type GlassBoxClassName,
  type GlassBoxComposition,
  type GlassBoxLayer,
  type GlassBoxShadowLayer,
} from '@eds/mobile-components';

export type { GlassBoxClassName, GlassBoxComposition, GlassBoxLayer, GlassBoxShadowLayer };

export function resolveGlassBoxPreviewComposition(
  className: GlassBoxClassName,
  mode: 'light' | 'dark',
): GlassBoxComposition {
  return resolveGlassBoxComposition(className, mode);
}
