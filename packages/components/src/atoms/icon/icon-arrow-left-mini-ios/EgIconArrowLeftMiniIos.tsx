import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconArrowLeftMiniIosProps } from './EgIconArrowLeftMiniIos.types.js';

/** RN icon — eds-arrow-left-mini-ios */
export function EgIconArrowLeftMiniIos(props: EgIconArrowLeftMiniIosProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-arrow-left-mini-ios"
      testID={testID ?? 'icon-eds-arrow-left-mini-ios'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-arrow-left-mini-ios"}
    />
  );
}
