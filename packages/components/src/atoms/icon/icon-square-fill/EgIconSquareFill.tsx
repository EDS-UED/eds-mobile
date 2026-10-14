import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconSquareFillProps } from './EgIconSquareFill.types.js';

/** RN icon — eds-square-fill */
export function EgIconSquareFill(props: EgIconSquareFillProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-square-fill"
      testID={testID ?? 'icon-eds-square-fill'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-square-fill"}
    />
  );
}
