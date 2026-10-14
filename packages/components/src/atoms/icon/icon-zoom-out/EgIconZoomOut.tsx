import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconZoomOutProps } from './EgIconZoomOut.types.js';

/** RN icon — eds-zoom-out */
export function EgIconZoomOut(props: EgIconZoomOutProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-zoom-out"
      testID={testID ?? 'icon-eds-zoom-out'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-zoom-out"}
    />
  );
}
