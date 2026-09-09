import { View, type ViewProps } from 'react-native';
import type { EgComboTextareaInputProps } from './EgComboTextareaInput.types';

/** RN implementation — Combo/Textarea Input (component) */
export function EgComboTextareaInput(props: EgComboTextareaInputProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'input-combo-textarea-input' } style={style} accessibilityLabel="Combo/Textarea Input" />;
}
