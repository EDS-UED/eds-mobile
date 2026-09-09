import { View, type ViewProps } from 'react-native';
import type { EgIconClearProps } from './EgIconClear.types';

/** RN implementation — eds-clear (component) */
export function EgIconClear(props: EgIconClearProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-clear' } style={style} accessibilityLabel="eds-clear" />;
}
