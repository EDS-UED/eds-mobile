import { View, type ViewProps } from 'react-native';
import type { EgTabBarGlassBgProps } from './EgTabBarGlassBg.types';

/** RN implementation — Glass BG. (set · 2 variants) */
export function EgTabBarGlassBg(props: EgTabBarGlassBgProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'tab-bar-glass-bg' } style={style} accessibilityLabel="Glass BG." />;
}
