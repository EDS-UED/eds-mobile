import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconArrowUpIosProps } from './EgIconArrowUpIos.types.js';

/** RN icon — eds-arrow-up-ios */
export function EgIconArrowUpIos(props: EgIconArrowUpIosProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-arrow-up-ios"
      testID={testID ?? 'icon-eds-arrow-up-ios'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-arrow-up-ios"}
    />
  );
}
