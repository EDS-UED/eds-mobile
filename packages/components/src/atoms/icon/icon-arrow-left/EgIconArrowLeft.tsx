import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconArrowLeftProps } from './EgIconArrowLeft.types.js';

/** RN icon — eds-arrow-left */
export function EgIconArrowLeft(props: EgIconArrowLeftProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-arrow-left"
      testID={testID ?? 'icon-eds-arrow-left'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-arrow-left"}
    />
  );
}
