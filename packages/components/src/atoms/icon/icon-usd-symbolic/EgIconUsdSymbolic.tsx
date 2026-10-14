import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconUsdSymbolicProps } from './EgIconUsdSymbolic.types.js';

/** RN icon — eds-usd-symbolic */
export function EgIconUsdSymbolic(props: EgIconUsdSymbolicProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-usd-symbolic"
      testID={testID ?? 'icon-eds-usd-symbolic'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-usd-symbolic"}
    />
  );
}
