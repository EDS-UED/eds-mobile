import { View, type ViewProps } from 'react-native';
import type { EgTabBarProps } from './EgTabBar.types';

/** RN implementation — TabBar (set · 10 variants) */
export function EgTabBar(props: EgTabBarProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'tab-bar-base' } style={style} accessibilityLabel="TabBar" />;
}
