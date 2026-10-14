import { StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native';

import { getThemeColors } from '../../../theme/index.js';
import {
  EG_DIVIDER_DEFAULT_VERTICAL_LENGTH_PX,
  EG_DIVIDER_STROKE_THICKNESS_PX,
} from './egDividerMetrics.js';
import type { EgDividerProps, EgDividerVariant } from './EgDivider.types.js';

function dividerColorToken(variant: EgDividerVariant): 'stroke-divider-module' | 'stroke-divider-page' {
  return variant === 'module' ? 'stroke-divider-module' : 'stroke-divider-page';
}

/** Token `stroke-xs` 可能低于 RN 物理最小线宽，layout 用 hairline 保底。 */
function strokeXsLayoutThickness(): number {
  const spec = EG_DIVIDER_STROKE_THICKNESS_PX;
  const hairline = StyleSheet.hairlineWidth;
  return spec > 0 && spec < hairline ? hairline : spec;
}

export function EgDivider({
  variant = 'page',
  orientation = 'horizontal',
  visible = true,
  length,
  mode = 'light',
  testID,
  style,
  accessibilityLabel,
}: EgDividerProps & Pick<ViewProps, 'style'>) {
  if (!visible) {
    return null;
  }

  const thickness = strokeXsLayoutThickness();
  const lineColor = getThemeColors(mode)[dividerColorToken(variant)] as string;

  const lineStyle: ViewStyle =
    orientation === 'horizontal'
      ? {
          alignSelf: 'stretch',
          width: length ?? '100%',
          height: thickness,
          backgroundColor: lineColor,
        }
      : {
          width: 0,
          height: length ?? EG_DIVIDER_DEFAULT_VERTICAL_LENGTH_PX,
          borderLeftWidth: thickness,
          borderLeftColor: lineColor,
        };

  return (
    <View
      testID={testID ?? 'divider'}
      style={StyleSheet.flatten([styles.base, lineStyle, style])}
      accessibilityRole="none"
      accessibilityLabel={accessibilityLabel}
      importantForAccessibility="no"
    />
  );
}

const styles = StyleSheet.create({
  base: {
    flexShrink: 0,
  },
});
