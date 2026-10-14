import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconInterfaceLockFillProps } from './EgIconInterfaceLockFill.types.js';

/** RN icon — eds-interface-lock-fill */
export function EgIconInterfaceLockFill(props: EgIconInterfaceLockFillProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-interface-lock-fill"
      testID={testID ?? 'icon-eds-interface-lock-fill'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-interface-lock-fill"}
    />
  );
}
