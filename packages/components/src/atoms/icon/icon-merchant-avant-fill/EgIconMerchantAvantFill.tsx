import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconMerchantAvantFillProps } from './EgIconMerchantAvantFill.types.js';

/** RN icon — eds-merchant-avant-fill */
export function EgIconMerchantAvantFill(props: EgIconMerchantAvantFillProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-merchant-avant-fill"
      testID={testID ?? 'icon-eds-merchant-avant-fill'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-merchant-avant-fill"}
    />
  );
}
