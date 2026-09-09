import { View, type ViewProps } from 'react-native';
import type { EgComboActionButtonAltProps } from './EgComboActionButtonAlt.types';

/** RN implementation — Combo/Action (set · 2 variants) */
export function EgComboActionButtonAlt(props: EgComboActionButtonAltProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'button-combo-action-alt' } style={style} accessibilityLabel="Combo/Action" />;
}
