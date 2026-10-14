import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconArrowRightProps } from './EgIconArrowRight.types.js';

/** RN icon — eds-arrow-right */
export function EgIconArrowRight(props: EgIconArrowRightProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-arrow-right"
      testID={testID ?? 'icon-eds-arrow-right'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-arrow-right"}
    />
  );
}
