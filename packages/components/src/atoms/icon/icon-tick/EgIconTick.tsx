import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconTickProps } from './EgIconTick.types.js';

/** RN icon — eds-tick */
export function EgIconTick(props: EgIconTickProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-tick"
      testID={testID ?? 'icon-eds-tick'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-tick"}
    />
  );
}
