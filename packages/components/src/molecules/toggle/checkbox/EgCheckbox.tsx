import { View, type ViewProps } from 'react-native';
import type { EgCheckboxProps } from './EgCheckbox.types';

/** RN implementation — Checkbox (set · 4 variants) */
export function EgCheckbox(props: EgCheckboxProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'toggle-checkbox' } style={style} accessibilityLabel="Checkbox" />;
}
