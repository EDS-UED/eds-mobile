import { StyleSheet, View, type ViewProps } from 'react-native';

import { getThemeColors, mobileTheme } from '../../../theme/index.js';
import { egReddotSizePx } from './egReddotMetrics.js';
import type { EgReddotProps } from './EgReddot.types.js';

const radiusFull = mobileTheme.spacing['radius-full'] as number;

export function EgReddot(props: EgReddotProps & Pick<ViewProps, 'style'>) {
  const { mode = 'light', testID, style, accessibilityLabel = 'Red dot' } = props;
  const colors = getThemeColors(mode);
  const size = egReddotSizePx;

  return (
    <View
      testID={testID ?? 'feedback-reddot'}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="image"
      style={[
        styles.dot,
        {
          width: size,
          height: size,
          borderRadius: radiusFull,
          backgroundColor: colors['status-danger'] as string,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dot: {
    flexShrink: 0,
  },
});
