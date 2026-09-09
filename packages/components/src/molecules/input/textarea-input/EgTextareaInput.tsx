import { View, type ViewProps } from 'react-native';
import type { EgTextareaInputProps } from './EgTextareaInput.types';

/** RN implementation — Textarea (set · 5 variants) */
export function EgTextareaInput(props: EgTextareaInputProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'input-textarea' } style={style} accessibilityLabel="Textarea" />;
}
