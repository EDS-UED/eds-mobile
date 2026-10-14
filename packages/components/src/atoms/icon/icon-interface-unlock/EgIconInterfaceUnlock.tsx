import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconInterfaceUnlockProps } from './EgIconInterfaceUnlock.types.js';

/** RN icon — eds-interface-unlock */
export function EgIconInterfaceUnlock(props: EgIconInterfaceUnlockProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-interface-unlock"
      testID={testID ?? 'icon-eds-interface-unlock'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-interface-unlock"}
    />
  );
}
