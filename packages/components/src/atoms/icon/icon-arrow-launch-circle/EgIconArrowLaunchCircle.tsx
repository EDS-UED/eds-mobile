import { View, type ViewProps } from 'react-native';
import type { EgIconArrowLaunchCircleProps } from './EgIconArrowLaunchCircle.types';

/** RN implementation — eds-arrow-launch-circle (component) */
export function EgIconArrowLaunchCircle(props: EgIconArrowLaunchCircleProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-arrow-launch-circle' } style={style} accessibilityLabel="eds-arrow-launch-circle" />;
}
