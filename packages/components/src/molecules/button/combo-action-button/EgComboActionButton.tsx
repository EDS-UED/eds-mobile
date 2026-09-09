import { View, type ViewProps } from 'react-native';
import type { EgComboActionButtonProps } from './EgComboActionButton.types';

/** RN implementation — Combo/Action (set · 2 variants) */
export function EgComboActionButton(props: EgComboActionButtonProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'button-combo-action' } style={style} accessibilityLabel="Combo/Action" />;
}
