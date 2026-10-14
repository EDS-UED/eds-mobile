import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconCirculationFillProps } from './EgIconCirculationFill.types.js';

/** RN icon — eds-circulation-fill */
export function EgIconCirculationFill(props: EgIconCirculationFillProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-circulation-fill"
      testID={testID ?? 'icon-eds-circulation-fill'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-circulation-fill"}
    />
  );
}
