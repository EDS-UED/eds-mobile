import { View, type ViewProps } from 'react-native';
import type { EgTextDisplayProps } from './EgTextDisplay.types';

/** RN implementation — 1-Display (set · 3 variants) */
export function EgTextDisplay(props: EgTextDisplayProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'text-display' } style={style} accessibilityLabel="1-Display" />;
}
