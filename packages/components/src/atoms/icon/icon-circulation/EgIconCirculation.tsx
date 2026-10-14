import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconCirculationProps } from './EgIconCirculation.types.js';

/** RN icon — eds-circulation */
export function EgIconCirculation(props: EgIconCirculationProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-circulation"
      testID={testID ?? 'icon-eds-circulation'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-circulation"}
    />
  );
}
