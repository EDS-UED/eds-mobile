import { View, type ViewProps } from 'react-native';
import type { EgCregisTabBarProps } from './EgCregisTabBar.types';

/** RN implementation — Apply_TabBar@Cregis (set · 2 variants) */
export function EgCregisTabBar(props: EgCregisTabBarProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'tab-bar-cregis' } style={style} accessibilityLabel="Apply_TabBar@Cregis" />;
}
