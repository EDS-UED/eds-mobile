import { View, type ViewProps } from 'react-native';
import type { EgSwitchProps } from './EgSwitch.types';

/** RN implementation — Switch (set · 6 variants) */
export function EgSwitch(props: EgSwitchProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'toggle-switch' } style={style} accessibilityLabel="Switch" />;
}
