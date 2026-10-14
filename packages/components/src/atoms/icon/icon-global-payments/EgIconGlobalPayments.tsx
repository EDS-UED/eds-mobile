import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconGlobalPaymentsProps } from './EgIconGlobalPayments.types.js';

/** RN icon — eds-global-payments */
export function EgIconGlobalPayments(props: EgIconGlobalPaymentsProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-global-payments"
      testID={testID ?? 'icon-eds-global-payments'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-global-payments"}
    />
  );
}
