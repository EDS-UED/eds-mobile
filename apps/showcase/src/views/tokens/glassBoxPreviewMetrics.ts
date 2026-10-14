import mobileTheme from '@eds/mobile-tokens/theme';

import { edsSmoothRadius } from '@/views/shared/resolveEdsTheme';
import { resolveGlassBoxPreviewComposition, type GlassBoxClassName } from '@/views/tokens/glassBoxPreviewTypes';

/** Showcase 专用预览边长 — 对齐 Figma Glass Box 组件集 240px。 */
export const GLASS_BOX_PREVIEW_SIZE_PX = 240;

/** 毛玻璃背衬色块 — 居中叠在玻璃盒背面。 */
export const GLASS_BOX_BACKDROP_ORB_PX = 144;

export function glassBoxPreviewSizePx(): number {
  return GLASS_BOX_PREVIEW_SIZE_PX;
}

export function glassBoxPreviewRadiusStyle(className: string, compositionRadius?: number) {
  if (className === 'glass-mask-box' || compositionRadius == null || compositionRadius <= 0) {
    return { borderRadius: 0 } as const;
  }

  const radiusXl = mobileTheme.spacing['radius-xl'] as number;
  if (compositionRadius === radiusXl) {
    return edsSmoothRadius('radius-xl');
  }

  return {
    borderRadius: compositionRadius,
    borderCurve: 'continuous' as const,
  };
}

export function glassBoxPreviewBorderWidth(): number {
  return mobileTheme.spacing['stroke-xs'] as number;
}

/** 外阴影向下溢出 — 只撑开展示区，不挤标题间距。 */
export function glassBoxPreviewShadowBleed(
  className: GlassBoxClassName,
  mode: 'light' | 'dark',
): number {
  const composition = resolveGlassBoxPreviewComposition(className, mode);
  const outer = composition.shadows.find((shadow) => !shadow.inset);
  if (!outer) {
    return mobileTheme.spacing['spacing-4'] as number;
  }
  const bleed = Math.round(outer.offsetY + outer.blurRadius * 0.28);
  return Math.min(96, Math.max(16, bleed));
}
