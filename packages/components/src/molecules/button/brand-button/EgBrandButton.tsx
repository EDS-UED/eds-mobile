import { View, type ViewProps } from 'react-native';
import type { EgBrandButtonProps } from './EgBrandButton.types';

/** RN implementation — Brand (set · 60 variants) */
export function EgBrandButton(props: EgBrandButtonProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'button-brand' } style={style} accessibilityLabel="Brand" />;
}
