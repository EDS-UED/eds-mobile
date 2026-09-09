import { View, type ViewProps } from 'react-native';
import type { EgIconUserPointerProps } from './EgIconUserPointer.types';

/** RN implementation — eds-user-pointer (component) */
export function EgIconUserPointer(props: EgIconUserPointerProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-user-pointer' } style={style} accessibilityLabel="eds-user-pointer" />;
}
