import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconArrowDownMiniIosProps } from './EgIconArrowDownMiniIos.types.js';

/** RN icon — eds-arrow-down-mini-ios */
export function EgIconArrowDownMiniIos(props: EgIconArrowDownMiniIosProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-arrow-down-mini-ios"
      testID={testID ?? 'icon-eds-arrow-down-mini-ios'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-arrow-down-mini-ios"}
    />
  );
}
