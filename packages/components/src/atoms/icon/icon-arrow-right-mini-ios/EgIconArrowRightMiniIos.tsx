import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconArrowRightMiniIosProps } from './EgIconArrowRightMiniIos.types.js';

/** RN icon — eds-arrow-right-mini-ios */
export function EgIconArrowRightMiniIos(props: EgIconArrowRightMiniIosProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-arrow-right-mini-ios"
      testID={testID ?? 'icon-eds-arrow-right-mini-ios'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-arrow-right-mini-ios"}
    />
  );
}
