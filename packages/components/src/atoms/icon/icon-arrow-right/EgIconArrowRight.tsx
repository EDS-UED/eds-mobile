import { View, type ViewProps } from 'react-native';
import type { EgIconArrowRightProps } from './EgIconArrowRight.types';

/** RN implementation — eds-arrow-right (component) */
export function EgIconArrowRight(props: EgIconArrowRightProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-arrow-right' } style={style} accessibilityLabel="eds-arrow-right" />;
}
