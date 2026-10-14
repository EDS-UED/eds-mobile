import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconArrowUpdateProps } from './EgIconArrowUpdate.types.js';

/** RN icon — eds-arrow-update */
export function EgIconArrowUpdate(props: EgIconArrowUpdateProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-arrow-update"
      testID={testID ?? 'icon-eds-arrow-update'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-arrow-update"}
    />
  );
}
