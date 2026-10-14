import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconArrowRefusesProps } from './EgIconArrowRefuses.types.js';

/** RN icon — eds-arrow-refuses */
export function EgIconArrowRefuses(props: EgIconArrowRefusesProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-arrow-refuses"
      testID={testID ?? 'icon-eds-arrow-refuses'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-arrow-refuses"}
    />
  );
}
