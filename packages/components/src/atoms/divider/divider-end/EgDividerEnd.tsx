import { StyleSheet, View, type ViewProps } from 'react-native';

import { getThemeColors } from '../../../theme/index.js';
import {
  EG_DIVIDER_END_DOT_SIZE,
  EG_DIVIDER_END_GAP,
  egDividerStrokeLayoutThickness,
} from '../divider/egDividerMetrics.js';
import type { EgDividerEndProps } from './EgDividerEnd.types.js';

/** `EgDivider` 场景化尾分 — 左线 + `stroke-divider-deep` 圆点 + 右线。 */
export function EgDividerEnd({
  mode = 'light',
  testID,
  style,
  accessibilityLabel,
}: EgDividerEndProps & Pick<ViewProps, 'style'>) {
  const lineColor = getThemeColors(mode)['stroke-divider-deep'] as string;
  const thickness = egDividerStrokeLayoutThickness();

  return (
    <View
      testID={testID ?? 'divider-end'}
      style={StyleSheet.flatten([styles.row, { gap: EG_DIVIDER_END_GAP }, style])}
      accessibilityRole="none"
      accessibilityLabel={accessibilityLabel}
      importantForAccessibility="no"
    >
      <View style={[styles.line, { height: thickness, backgroundColor: lineColor }]} />
      <View
        style={[
          styles.dot,
          {
            width: EG_DIVIDER_END_DOT_SIZE,
            height: EG_DIVIDER_END_DOT_SIZE,
            borderRadius: EG_DIVIDER_END_DOT_SIZE / 2,
            backgroundColor: lineColor,
          },
        ]}
      />
      <View style={[styles.line, { height: thickness, backgroundColor: lineColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  line: {
    flex: 1,
  },
  dot: {
    flexShrink: 0,
  },
});