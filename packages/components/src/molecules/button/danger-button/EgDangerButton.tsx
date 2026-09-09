import { View, type ViewProps } from 'react-native';
import type { EgDangerButtonProps } from './EgDangerButton.types';

/** RN implementation — Danger (set · 60 variants) */
export function EgDangerButton(props: EgDangerButtonProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'button-danger' } style={style} accessibilityLabel="Danger" />;
}
