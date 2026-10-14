import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconArrowDownIosProps } from './EgIconArrowDownIos.types.js';

/** RN icon — eds-arrow-down-ios */
export function EgIconArrowDownIos(props: EgIconArrowDownIosProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-arrow-down-ios"
      testID={testID ?? 'icon-eds-arrow-down-ios'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-arrow-down-ios"}
    />
  );
}
