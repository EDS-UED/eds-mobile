import { View, type ViewProps } from 'react-native';
import type { EgIconAddCircleProps } from './EgIconAddCircle.types';

/** RN implementation — eds-add-circle (component) */
export function EgIconAddCircle(props: EgIconAddCircleProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-add-circle' } style={style} accessibilityLabel="eds-add-circle" />;
}
