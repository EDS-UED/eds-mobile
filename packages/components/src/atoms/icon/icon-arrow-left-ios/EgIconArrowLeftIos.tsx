import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconArrowLeftIosProps } from './EgIconArrowLeftIos.types.js';

/** RN icon — eds-arrow-left-ios */
export function EgIconArrowLeftIos(props: EgIconArrowLeftIosProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-arrow-left-ios"
      testID={testID ?? 'icon-eds-arrow-left-ios'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-arrow-left-ios"}
    />
  );
}
