import { View, type ViewProps } from 'react-native';
import type { EgIconWorldDollarProps } from './EgIconWorldDollar.types';

/** RN implementation — eds-world-dollar (component) */
export function EgIconWorldDollar(props: EgIconWorldDollarProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-world-dollar' } style={style} accessibilityLabel="eds-world-dollar" />;
}
