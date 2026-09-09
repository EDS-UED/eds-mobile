import { View, type ViewProps } from 'react-native';
import type { EgQuickInputProps } from './EgQuickInput.types';

/** RN implementation — Quick Input (set · 2 variants) */
export function EgQuickInput(props: EgQuickInputProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'input-quick-input' } style={style} accessibilityLabel="Quick Input" />;
}
