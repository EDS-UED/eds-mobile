import { View, type ViewProps } from 'react-native';
import type { EgIconPasskeyFillProps } from './EgIconPasskeyFill.types';

/** RN implementation — eds-passkey-fill (component) */
export function EgIconPasskeyFill(props: EgIconPasskeyFillProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-passkey-fill' } style={style} accessibilityLabel="eds-passkey-fill" />;
}
