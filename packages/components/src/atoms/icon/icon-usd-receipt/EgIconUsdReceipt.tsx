import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconUsdReceiptProps } from './EgIconUsdReceipt.types.js';

/** RN icon — eds-usd-receipt */
export function EgIconUsdReceipt(props: EgIconUsdReceiptProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-usd-receipt"
      testID={testID ?? 'icon-eds-usd-receipt'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-usd-receipt"}
    />
  );
}
