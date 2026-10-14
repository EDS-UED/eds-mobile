import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconBillFillProps } from './EgIconBillFill.types.js';

/** RN icon — eds-bill-fill */
export function EgIconBillFill(props: EgIconBillFillProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-bill-fill"
      testID={testID ?? 'icon-eds-bill-fill'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-bill-fill"}
    />
  );
}
