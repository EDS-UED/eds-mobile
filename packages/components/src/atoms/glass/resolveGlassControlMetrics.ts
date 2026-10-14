import type { ViewStyle } from 'react-native';
import { mobileTheme } from '../../theme/index.js';
import type { GlassControlShape } from './types.js';

export type GlassControlMetrics = {
  /** iOS toolbar control height / circle diameter (44pt). */
  controlSize: number;
  pillPaddingHorizontal: number;
  pillPaddingVertical: number;
  radiusFull: number;
};

/** Toolbar glass pill / circle geometry — spacing-10 + spacing-1 = 44px. */
export function resolveGlassControlMetrics(shape: GlassControlShape): GlassControlMetrics {
  const spacing = mobileTheme.spacing;
  const controlSize =
    (spacing['spacing-10'] as number) + (spacing['spacing-1'] as number);
  const radiusFull = spacing['radius-full'] as number;

  if (shape === 'circle') {
    return {
      controlSize,
      pillPaddingHorizontal: 0,
      pillPaddingVertical: 0,
      radiusFull,
    };
  }

  return {
    controlSize,
    pillPaddingHorizontal: spacing['spacing-5'] as number,
    pillPaddingVertical: spacing['spacing-2'] as number,
    radiusFull,
  };
}

/** Native / fallback shell — circle 44×44；pill minHeight + horizontal padding。 */
export function resolveGlassControlShellStyle(shape: GlassControlShape): ViewStyle {
  const { controlSize, pillPaddingHorizontal, pillPaddingVertical, radiusFull } =
    resolveGlassControlMetrics(shape);

  if (shape === 'circle') {
    return {
      width: controlSize,
      height: controlSize,
      borderRadius: radiusFull,
    };
  }

  return {
    minHeight: controlSize,
    paddingHorizontal: pillPaddingHorizontal,
    paddingVertical: pillPaddingVertical,
    borderRadius: radiusFull,
    alignSelf: 'flex-start',
  };
}
