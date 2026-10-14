import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconArrowDownProps } from './EgIconArrowDown.types.js';

/** RN icon — eds-arrow-down */
export function EgIconArrowDown(props: EgIconArrowDownProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-arrow-down"
      testID={testID ?? 'icon-eds-arrow-down'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-arrow-down"}
    />
  );
}
