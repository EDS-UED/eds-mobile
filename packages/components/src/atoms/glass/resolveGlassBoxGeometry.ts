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
  if (compositionRadius === radiusXl) {
    return {
      borderRadius: radiusXl,
      borderCurve: 'continuous',
    };
  }

  return {
    borderRadius: compositionRadius,
    borderCurve: 'continuous',
  };
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
