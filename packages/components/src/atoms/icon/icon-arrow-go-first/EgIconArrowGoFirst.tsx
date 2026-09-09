import { View, type ViewProps } from 'react-native';
import type { EgIconArrowGoFirstProps } from './EgIconArrowGoFirst.types';

/** RN implementation — eds-arrow-go-first (component) */
export function EgIconArrowGoFirst(props: EgIconArrowGoFirstProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-arrow-go-first' } style={style} accessibilityLabel="eds-arrow-go-first" />;
}
