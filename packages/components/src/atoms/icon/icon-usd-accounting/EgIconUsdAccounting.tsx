import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconUsdAccountingProps } from './EgIconUsdAccounting.types.js';

/** RN icon — eds-usd-accounting */
export function EgIconUsdAccounting(props: EgIconUsdAccountingProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-usd-accounting"
      testID={testID ?? 'icon-eds-usd-accounting'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-usd-accounting"}
    />
  );
}
