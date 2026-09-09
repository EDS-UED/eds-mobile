import { View, type ViewProps } from 'react-native';
import type { EgComboTextInputProps } from './EgComboTextInput.types';

/** RN implementation — Combo/Text Input (component) */
export function EgComboTextInput(props: EgComboTextInputProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'input-combo-text-input' } style={style} accessibilityLabel="Combo/Text Input" />;
}
