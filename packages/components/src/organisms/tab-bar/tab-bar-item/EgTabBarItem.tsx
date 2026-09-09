import { View, type ViewProps } from 'react-native';
import type { EgTabBarItemProps } from './EgTabBarItem.types';

/** RN implementation — TabBar-Item (set · 4 variants) */
export function EgTabBarItem(props: EgTabBarItemProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'tab-bar-item' } style={style} accessibilityLabel="TabBar-Item" />;
}
