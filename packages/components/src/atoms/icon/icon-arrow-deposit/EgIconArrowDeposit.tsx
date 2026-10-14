import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconArrowDepositProps } from './EgIconArrowDeposit.types.js';

/** RN icon — eds-arrow-deposit */
export function EgIconArrowDeposit(props: EgIconArrowDepositProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-arrow-deposit"
      testID={testID ?? 'icon-eds-arrow-deposit'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-arrow-deposit"}
    />
  );
}
