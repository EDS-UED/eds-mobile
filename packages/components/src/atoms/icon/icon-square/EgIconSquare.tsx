import { View, type ViewProps } from 'react-native';
import type { EgIconSquareProps } from './EgIconSquare.types';

/** RN implementation — eds-square (component) */
export function EgIconSquare(props: EgIconSquareProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-square' } style={style} accessibilityLabel="eds-square" />;
}
