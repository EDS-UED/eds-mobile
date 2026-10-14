import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconZoomInProps } from './EgIconZoomIn.types.js';

/** RN icon — eds-zoom-in */
export function EgIconZoomIn(props: EgIconZoomInProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-zoom-in"
      testID={testID ?? 'icon-eds-zoom-in'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-zoom-in"}
    />
  );
}
