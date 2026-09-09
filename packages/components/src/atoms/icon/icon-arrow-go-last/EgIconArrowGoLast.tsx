import { View, type ViewProps } from 'react-native';
import type { EgIconArrowGoLastProps } from './EgIconArrowGoLast.types';

/** RN implementation — eds-arrow-go-last (component) */
export function EgIconArrowGoLast(props: EgIconArrowGoLastProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-arrow-go-last' } style={style} accessibilityLabel="eds-arrow-go-last" />;
}
