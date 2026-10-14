import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconArrowWithdrawalProps } from './EgIconArrowWithdrawal.types.js';

/** RN icon — eds-arrow-withdrawal */
export function EgIconArrowWithdrawal(props: EgIconArrowWithdrawalProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-arrow-withdrawal"
      testID={testID ?? 'icon-eds-arrow-withdrawal'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-arrow-withdrawal"}
    />
  );
}
