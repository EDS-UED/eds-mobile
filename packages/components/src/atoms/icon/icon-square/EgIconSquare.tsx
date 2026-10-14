import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconSquareProps } from './EgIconSquare.types.js';

/** RN icon — eds-square */
export function EgIconSquare(props: EgIconSquareProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-square"
      testID={testID ?? 'icon-eds-square'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-square"}
    />
  );
}
