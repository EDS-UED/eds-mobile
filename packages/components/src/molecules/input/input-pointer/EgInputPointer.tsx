import { View, type ViewProps } from 'react-native';
import type { EgInputPointerProps } from './EgInputPointer.types';

/** RN implementation — Input/Pointer (component) */
export function EgInputPointer(props: EgInputPointerProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'input-pointer' } style={style} accessibilityLabel="Input/Pointer" />;
}
