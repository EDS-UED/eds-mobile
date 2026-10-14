import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconInterfaceLockProps } from './EgIconInterfaceLock.types.js';

/** RN icon — eds-interface-lock */
export function EgIconInterfaceLock(props: EgIconInterfaceLockProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-interface-lock"
      testID={testID ?? 'icon-eds-interface-lock'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-interface-lock"}
    />
  );
}
