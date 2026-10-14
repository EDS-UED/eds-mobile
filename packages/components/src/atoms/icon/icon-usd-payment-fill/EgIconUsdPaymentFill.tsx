import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconUsdPaymentFillProps } from './EgIconUsdPaymentFill.types.js';

/** RN icon — eds-usd-payment-fill */
export function EgIconUsdPaymentFill(props: EgIconUsdPaymentFillProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-usd-payment-fill"
      testID={testID ?? 'icon-eds-usd-payment-fill'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-usd-payment-fill"}
    />
  );
}
