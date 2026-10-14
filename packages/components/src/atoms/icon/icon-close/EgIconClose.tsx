import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconCloseProps } from './EgIconClose.types.js';

/** RN icon — eds-close */
export function EgIconClose(props: EgIconCloseProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-close"
      testID={testID ?? 'icon-eds-close'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-close"}
    />
  );
}
