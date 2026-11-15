import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { getThemeColors } from '../../theme/index.js';
import { EG_ITEM_GROUP_INSET, EG_ITEM_GROUP_RADIUS } from './egItemMetrics.js';
import type { EgItemGroupProps } from './EgItemGroup.types.js';

/** 设置分组卡片 · 个人中心 `PersonalCenterSettingsGroup` 对齐。 */
export function EgItemGroup({ children, testID, mode = 'light', style }: EgItemGroupProps) {
  const colors = getThemeColors(mode);

  const cardStyle = StyleSheet.flatten([
    styles.card,
    { backgroundColor: colors['material-card-same-white'] as string },
    style,
  ]) as ViewStyle;

  return (
    <View testID={testID} style={cardStyle as StyleProp<ViewStyle>}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'stretch',
    padding: EG_ITEM_GROUP_INSET,
    overflow: 'hidden',
    borderRadius: EG_ITEM_GROUP_RADIUS,
    borderCurve: 'continuous',
  },
});