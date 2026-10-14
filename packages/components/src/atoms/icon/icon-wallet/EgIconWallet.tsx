import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconWalletProps } from './EgIconWallet.types.js';

/** RN icon — eds-wallet */
export function EgIconWallet(props: EgIconWalletProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-wallet"
      testID={testID ?? 'icon-eds-wallet'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-wallet"}
    />
  );
}
