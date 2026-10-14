import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconWalletFillProps } from './EgIconWalletFill.types.js';

/** RN icon — eds-wallet-fill */
export function EgIconWalletFill(props: EgIconWalletFillProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-wallet-fill"
      testID={testID ?? 'icon-eds-wallet-fill'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-wallet-fill"}
    />
  );
}
