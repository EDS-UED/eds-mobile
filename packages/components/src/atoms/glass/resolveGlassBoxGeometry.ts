import { mobileTheme } from '../../theme/index.js';
import type { ViewStyle } from 'react-native';

import type { GlassBoxClassName } from './resolveGlassBox.js';

export function glassBoxDefaultBorderWidth(): number {
  return mobileTheme.spacing['stroke-xs'] as number;
}

/** 非胶囊 Glass Box 圆角 — 对齐 Figma radius-xl + continuous curve。 */
export function glassBoxRadiusStyle(
  className: GlassBoxClassName,
  compositionRadius?: number,
): ViewStyle {
  if (className === 'glass-mask-box' || compositionRadius == null || compositionRadius <= 0) {
    return { borderRadius: 0 };
  }

  const radiusXl = mobileTheme.spacing['radius-xl'] as number;
  const radius2xl = mobileTheme.spacing['radius-2xl'] as number;
  if (compositionRadius === radiusXl || compositionRadius === radius2xl) {
    const radius = compositionRadius === radius2xl ? radius2xl : radiusXl;
    return {
      borderRadius: radius,
      borderCurve: 'continuous',
    };
  }

  return {
    borderRadius: compositionRadius,
    borderCurve: 'continuous',
  };
}

/** 实际圆角样式 · 非胶囊一律 continuous；被压到短边一半（胶囊）时按 §4.2 不加 borderCurve。 */
export function glassBoxCornerStyle(
  borderRadius: number,
  width: number,
  height: number,
): ViewStyle {
  if (borderRadius <= 0) {
    return { borderRadius: 0 };
  }
  const isCapsule = width > 0 && height > 0 && borderRadius >= Math.min(width, height) / 2;
  return isCapsule ? { borderRadius } : { borderRadius, borderCurve: 'continuous' };
}

export function capGlassBoxBorderRadius(
  borderRadius: number,
  width: number,
  height: number,
): number {
  if (width <= 0 || height <= 0) {
    return borderRadius;
  }
  return Math.min(borderRadius, Math.min(width, height) / 2);
}
