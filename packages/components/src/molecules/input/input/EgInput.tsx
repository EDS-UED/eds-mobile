import { View, type ViewProps } from 'react-native';
import type { EgInputProps } from './EgInput.types';

/** RN implementation — Input (set · 25 variants) */
export function EgInput(props: EgInputProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'input-input' } style={style} accessibilityLabel="Input" />;
}
