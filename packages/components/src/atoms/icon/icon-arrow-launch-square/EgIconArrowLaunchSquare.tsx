import { View, type ViewProps } from 'react-native';
import type { EgIconArrowLaunchSquareProps } from './EgIconArrowLaunchSquare.types';

/** RN implementation — eds-arrow-launch-square (component) */
export function EgIconArrowLaunchSquare(props: EgIconArrowLaunchSquareProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-arrow-launch-square' } style={style} accessibilityLabel="eds-arrow-launch-square" />;
}
