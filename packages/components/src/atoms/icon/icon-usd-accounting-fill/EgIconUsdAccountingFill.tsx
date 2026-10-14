import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconUsdAccountingFillProps } from './EgIconUsdAccountingFill.types.js';

/** RN icon — eds-usd-accounting-fill */
export function EgIconUsdAccountingFill(props: EgIconUsdAccountingFillProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-usd-accounting-fill"
      testID={testID ?? 'icon-eds-usd-accounting-fill'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-usd-accounting-fill"}
    />
  );
}
