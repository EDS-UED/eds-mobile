import { View, type ViewProps } from 'react-native';
import type { EgIconSquareFillProps } from './EgIconSquareFill.types';

/** RN implementation — eds-square-fill (component) */
export function EgIconSquareFill(props: EgIconSquareFillProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-square-fill' } style={style} accessibilityLabel="eds-square-fill" />;
}
