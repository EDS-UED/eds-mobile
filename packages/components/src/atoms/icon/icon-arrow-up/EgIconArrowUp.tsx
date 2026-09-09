import { View, type ViewProps } from 'react-native';
import type { EgIconArrowUpProps } from './EgIconArrowUp.types';

/** RN implementation — eds-arrow-up (component) */
export function EgIconArrowUp(props: EgIconArrowUpProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-arrow-up' } style={style} accessibilityLabel="eds-arrow-up" />;
}
