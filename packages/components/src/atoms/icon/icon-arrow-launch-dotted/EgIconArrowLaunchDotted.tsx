import { View, type ViewProps } from 'react-native';
import type { EgIconArrowLaunchDottedProps } from './EgIconArrowLaunchDotted.types';

/** RN implementation — eds-arrow-launch-dotted (component) */
export function EgIconArrowLaunchDotted(props: EgIconArrowLaunchDottedProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-arrow-launch-dotted' } style={style} accessibilityLabel="eds-arrow-launch-dotted" />;
}
