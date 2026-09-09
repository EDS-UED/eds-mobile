import { View, type ViewProps } from 'react-native';
import type { EgIconCirculationFillProps } from './EgIconCirculationFill.types';

/** RN implementation — eds-circulation-fill (component) */
export function EgIconCirculationFill(props: EgIconCirculationFillProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-circulation-fill' } style={style} accessibilityLabel="eds-circulation-fill" />;
}
