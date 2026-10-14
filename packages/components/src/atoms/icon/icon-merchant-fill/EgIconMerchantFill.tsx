import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconMerchantFillProps } from './EgIconMerchantFill.types.js';

/** RN icon — eds-merchant-fill */
export function EgIconMerchantFill(props: EgIconMerchantFillProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-merchant-fill"
      testID={testID ?? 'icon-eds-merchant-fill'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-merchant-fill"}
    />
  );
}
