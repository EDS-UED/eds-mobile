import { View, type ViewProps } from 'react-native';
import type { EgIconArrowToggleHorizontalProps } from './EgIconArrowToggleHorizontal.types';

/** RN implementation — eds-arrow-toggle-horizontal (component) */
export function EgIconArrowToggleHorizontal(props: EgIconArrowToggleHorizontalProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-arrow-toggle-horizontal' } style={style} accessibilityLabel="eds-arrow-toggle-horizontal" />;
}
