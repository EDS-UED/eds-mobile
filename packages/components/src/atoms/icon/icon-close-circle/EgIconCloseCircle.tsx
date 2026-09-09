import { View, type ViewProps } from 'react-native';
import type { EgIconCloseCircleProps } from './EgIconCloseCircle.types';

/** RN implementation — eds-close-circle (component) */
export function EgIconCloseCircle(props: EgIconCloseCircleProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-close-circle' } style={style} accessibilityLabel="eds-close-circle" />;
}
