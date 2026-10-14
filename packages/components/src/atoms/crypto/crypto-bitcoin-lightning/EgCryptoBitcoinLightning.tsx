import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgCryptoBitcoinLightningProps } from './EgCryptoBitcoinLightning.types.js';

/** RN crypto — eds-bitcoin-lightning-network */
export function EgCryptoBitcoinLightning(props: EgCryptoBitcoinLightningProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-bitcoin-lightning-network"
      testID={testID ?? 'crypto-bitcoin-lightning'}
      size={size}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-bitcoin-lightning-network"}
    />
  );
}
