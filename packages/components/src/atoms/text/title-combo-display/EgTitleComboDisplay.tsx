import { View, type ViewProps } from 'react-native';
import type { EgTitleComboDisplayProps } from './EgTitleComboDisplay.types';

/** RN implementation — Title Combo/1-Display (set · 3 variants) */
export function EgTitleComboDisplay(props: EgTitleComboDisplayProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'title-combo-display' } style={style} accessibilityLabel="Title Combo/1-Display" />;
}
