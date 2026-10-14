import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconPayeeProps } from './EgIconPayee.types.js';

/** RN icon — eds-payee */
export function EgIconPayee(props: EgIconPayeeProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-payee"
      testID={testID ?? 'icon-eds-payee'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-payee"}
    />
  );
}
