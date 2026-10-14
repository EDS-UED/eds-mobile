import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconInformationFillProps } from './EgIconInformationFill.types.js';

/** RN icon — eds-information-fill */
export function EgIconInformationFill(props: EgIconInformationFillProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-information-fill"
      testID={testID ?? 'icon-eds-information-fill'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-information-fill"}
    />
  );
}
