import { View, type ViewProps } from 'react-native';
import type { EgIconArrowDownProps } from './EgIconArrowDown.types';

/** RN implementation — eds-arrow-down (component) */
export function EgIconArrowDown(props: EgIconArrowDownProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-arrow-down' } style={style} accessibilityLabel="eds-arrow-down" />;
}
