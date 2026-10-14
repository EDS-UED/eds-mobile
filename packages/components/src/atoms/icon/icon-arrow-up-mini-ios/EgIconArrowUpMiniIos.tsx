import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconArrowUpMiniIosProps } from './EgIconArrowUpMiniIos.types.js';

/** RN icon — eds-arrow-up-mini-ios */
export function EgIconArrowUpMiniIos(props: EgIconArrowUpMiniIosProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-arrow-up-mini-ios"
      testID={testID ?? 'icon-eds-arrow-up-mini-ios'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-arrow-up-mini-ios"}
    />
  );
}
