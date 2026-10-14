import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconArrowCallbackProps } from './EgIconArrowCallback.types.js';

/** RN icon — eds-arrow-callback */
export function EgIconArrowCallback(props: EgIconArrowCallbackProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-arrow-callback"
      testID={testID ?? 'icon-eds-arrow-callback'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-arrow-callback"}
    />
  );
}
