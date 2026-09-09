import { View, type ViewProps } from 'react-native';
import type { EgIconArrowToggleVerticalProps } from './EgIconArrowToggleVertical.types';

/** RN implementation — eds-arrow-toggle-vertical (component) */
export function EgIconArrowToggleVertical(props: EgIconArrowToggleVerticalProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-arrow-toggle-vertical' } style={style} accessibilityLabel="eds-arrow-toggle-vertical" />;
}
