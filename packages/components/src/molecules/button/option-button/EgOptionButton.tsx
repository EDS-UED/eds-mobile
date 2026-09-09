import { View, type ViewProps } from 'react-native';
import type { EgOptionButtonProps } from './EgOptionButton.types';

/** RN implementation — Option (set · 20 variants) */
export function EgOptionButton(props: EgOptionButtonProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'button-option' } style={style} accessibilityLabel="Option" />;
}
