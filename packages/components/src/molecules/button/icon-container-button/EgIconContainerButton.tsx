import { View, type ViewProps } from 'react-native';
import type { EgIconContainerButtonProps } from './EgIconContainerButton.types';

/** RN implementation — iCon Container (set · 135 variants) */
export function EgIconContainerButton(props: EgIconContainerButtonProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'button-icon-container' } style={style} accessibilityLabel="iCon Container" />;
}
