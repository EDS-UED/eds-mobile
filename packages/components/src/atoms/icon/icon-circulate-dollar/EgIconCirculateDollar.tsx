import { View, type ViewProps } from 'react-native';
import type { EgIconCirculateDollarProps } from './EgIconCirculateDollar.types';

/** RN implementation — eds-circulate-dollar (component) */
export function EgIconCirculateDollar(props: EgIconCirculateDollarProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-circulate-dollar' } style={style} accessibilityLabel="eds-circulate-dollar" />;
}
