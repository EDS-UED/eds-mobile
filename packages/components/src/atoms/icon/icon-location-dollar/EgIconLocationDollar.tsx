import { View, type ViewProps } from 'react-native';
import type { EgIconLocationDollarProps } from './EgIconLocationDollar.types';

/** RN implementation — eds-location-dollar (component) */
export function EgIconLocationDollar(props: EgIconLocationDollarProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-location-dollar' } style={style} accessibilityLabel="eds-location-dollar" />;
}
