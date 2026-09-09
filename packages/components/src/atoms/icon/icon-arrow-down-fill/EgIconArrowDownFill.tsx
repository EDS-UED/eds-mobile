import { View, type ViewProps } from 'react-native';
import type { EgIconArrowDownFillProps } from './EgIconArrowDownFill.types';

/** RN implementation — eds-arrow-down-fill (component) */
export function EgIconArrowDownFill(props: EgIconArrowDownFillProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-arrow-down-fill' } style={style} accessibilityLabel="eds-arrow-down-fill" />;
}
