import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconUserPointerProps } from './EgIconUserPointer.types.js';

/** RN icon — eds-user-pointer */
export function EgIconUserPointer(props: EgIconUserPointerProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-user-pointer"
      testID={testID ?? 'icon-eds-user-pointer'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-user-pointer"}
    />
  );
}
