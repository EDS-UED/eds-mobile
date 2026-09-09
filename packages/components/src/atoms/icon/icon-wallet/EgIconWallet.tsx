import { View, type ViewProps } from 'react-native';
import type { EgIconWalletProps } from './EgIconWallet.types';

/** RN implementation — eds-wallet (component) */
export function EgIconWallet(props: EgIconWalletProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-wallet' } style={style} accessibilityLabel="eds-wallet" />;
}
