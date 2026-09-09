import { View, type ViewProps } from 'react-native';
import type { EgUDunTabBarProps } from './EgUDunTabBar.types';

/** RN implementation — Apply_TabBar@UDun (set · 2 variants) */
export function EgUDunTabBar(props: EgUDunTabBarProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'tab-bar-udun' } style={style} accessibilityLabel="Apply_TabBar@UDun" />;
}
