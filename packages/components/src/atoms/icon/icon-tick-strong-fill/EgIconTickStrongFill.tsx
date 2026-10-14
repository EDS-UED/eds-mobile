import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconTickStrongFillProps } from './EgIconTickStrongFill.types.js';

/** RN icon — eds-tick-strong-fill */
export function EgIconTickStrongFill(props: EgIconTickStrongFillProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-tick-strong-fill"
      testID={testID ?? 'icon-eds-tick-strong-fill'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-tick-strong-fill"}
    />
  );
}
