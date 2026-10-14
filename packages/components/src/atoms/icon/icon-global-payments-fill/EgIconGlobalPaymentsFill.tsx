import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconGlobalPaymentsFillProps } from './EgIconGlobalPaymentsFill.types.js';

/** RN icon — eds-global-payments -fill */
export function EgIconGlobalPaymentsFill(props: EgIconGlobalPaymentsFillProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-global-payments -fill"
      testID={testID ?? 'icon-eds-global-payments-fill'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-global-payments -fill"}
    />
  );
}
