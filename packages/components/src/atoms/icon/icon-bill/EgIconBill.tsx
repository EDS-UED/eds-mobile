import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconBillProps } from './EgIconBill.types.js';

/** RN icon — eds-bill */
export function EgIconBill(props: EgIconBillProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-bill"
      testID={testID ?? 'icon-eds-bill'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-bill"}
    />
  );
}
