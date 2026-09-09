import { View, type ViewProps } from 'react-native';
import type { EgIconCirculationProps } from './EgIconCirculation.types';

/** RN implementation — eds-circulation (component) */
export function EgIconCirculation(props: EgIconCirculationProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-circulation' } style={style} accessibilityLabel="eds-circulation" />;
}
