import { View, type ViewProps } from 'react-native';
import type { EgIconWalletFillProps } from './EgIconWalletFill.types';

/** RN implementation — eds-wallet-fill (component) */
export function EgIconWalletFill(props: EgIconWalletFillProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-wallet-fill' } style={style} accessibilityLabel="eds-wallet-fill" />;
}
