import { View, type ViewProps } from 'react-native';
import type { EgBaseTabProps } from './EgBaseTab.types';

/** RN implementation — Base_ Tab (set · 2 variants) */
export function EgBaseTab(props: EgBaseTabProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'tab-base-tab' } style={style} accessibilityLabel="Base_ Tab" />;
}
