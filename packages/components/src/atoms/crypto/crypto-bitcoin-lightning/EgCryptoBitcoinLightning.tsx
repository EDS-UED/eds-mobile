import { View, type ViewProps } from 'react-native';
import type { EgCryptoBitcoinLightningProps } from './EgCryptoBitcoinLightning.types';

/** RN implementation — eds-bitcoin-lightning-network (component) */
export function EgCryptoBitcoinLightning(props: EgCryptoBitcoinLightningProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'crypto-bitcoin-lightning' } style={style} accessibilityLabel="eds-bitcoin-lightning-network" />;
}
