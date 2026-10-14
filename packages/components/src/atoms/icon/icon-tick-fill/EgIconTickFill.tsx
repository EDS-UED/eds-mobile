import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconTickFillProps } from './EgIconTickFill.types.js';

/** RN icon — eds-tick-fill */
export function EgIconTickFill(props: EgIconTickFillProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-tick-fill"
      testID={testID ?? 'icon-eds-tick-fill'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-tick-fill"}
    />
  );
}
