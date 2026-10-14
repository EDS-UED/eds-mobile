import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconClearProps } from './EgIconClear.types.js';

/** RN icon — eds-clear */
export function EgIconClear(props: EgIconClearProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-clear"
      testID={testID ?? 'icon-eds-clear'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-clear"}
    />
  );
}
