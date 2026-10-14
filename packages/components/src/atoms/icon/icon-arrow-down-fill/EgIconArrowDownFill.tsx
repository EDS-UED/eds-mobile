import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconArrowDownFillProps } from './EgIconArrowDownFill.types.js';

/** RN icon — eds-arrow-down-fill */
export function EgIconArrowDownFill(props: EgIconArrowDownFillProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-arrow-down-fill"
      testID={testID ?? 'icon-eds-arrow-down-fill'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-arrow-down-fill"}
    />
  );
}
