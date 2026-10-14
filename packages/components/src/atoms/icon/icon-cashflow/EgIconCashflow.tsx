import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconCashflowProps } from './EgIconCashflow.types.js';

/** RN icon — eds-cashflow */
export function EgIconCashflow(props: EgIconCashflowProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-cashflow"
      testID={testID ?? 'icon-eds-cashflow'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-cashflow"}
    />
  );
}
