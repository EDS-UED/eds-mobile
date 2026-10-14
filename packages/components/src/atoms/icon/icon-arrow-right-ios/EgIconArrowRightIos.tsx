import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconArrowRightIosProps } from './EgIconArrowRightIos.types.js';

/** RN icon — eds-arrow-right-ios */
export function EgIconArrowRightIos(props: EgIconArrowRightIosProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-arrow-right-ios"
      testID={testID ?? 'icon-eds-arrow-right-ios'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-arrow-right-ios"}
    />
  );
}
