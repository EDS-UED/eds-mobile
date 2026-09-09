import { View, type ViewProps } from 'react-native';
import type { EgIconCircleProps } from './EgIconCircle.types';

/** RN implementation — eds-circle (component) */
export function EgIconCircle(props: EgIconCircleProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-circle' } style={style} accessibilityLabel="eds-circle" />;
}
