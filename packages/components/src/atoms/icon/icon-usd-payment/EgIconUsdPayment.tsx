import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconUsdPaymentProps } from './EgIconUsdPayment.types.js';

/** RN icon — eds-usd-payment */
export function EgIconUsdPayment(props: EgIconUsdPaymentProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-usd-payment"
      testID={testID ?? 'icon-eds-usd-payment'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-usd-payment"}
    />
  );
}
