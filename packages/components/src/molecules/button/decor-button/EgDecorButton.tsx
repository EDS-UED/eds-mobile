import { View, type ViewProps } from 'react-native';
import type { EgDecorButtonProps } from './EgDecorButton.types';

/** RN implementation — Decor (set · 60 variants) */
export function EgDecorButton(props: EgDecorButtonProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'button-decor' } style={style} accessibilityLabel="Decor" />;
}
