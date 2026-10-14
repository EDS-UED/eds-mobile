import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconPayorProps } from './EgIconPayor.types.js';

/** RN icon — eds-payor */
export function EgIconPayor(props: EgIconPayorProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-payor"
      testID={testID ?? 'icon-eds-payor'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-payor"}
    />
  );
}
