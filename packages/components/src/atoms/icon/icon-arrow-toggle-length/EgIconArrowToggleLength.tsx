import { View, type ViewProps } from 'react-native';
import type { EgIconArrowToggleLengthProps } from './EgIconArrowToggleLength.types';

/** RN implementation — eds-arrow-toggle-length (component) */
export function EgIconArrowToggleLength(props: EgIconArrowToggleLengthProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-arrow-toggle-length' } style={style} accessibilityLabel="eds-arrow-toggle-length" />;
}
