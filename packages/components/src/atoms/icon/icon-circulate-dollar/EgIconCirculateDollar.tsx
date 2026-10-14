import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconCirculateDollarProps } from './EgIconCirculateDollar.types.js';

/** RN icon — eds-circulate-dollar */
export function EgIconCirculateDollar(props: EgIconCirculateDollarProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-circulate-dollar"
      testID={testID ?? 'icon-eds-circulate-dollar'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-circulate-dollar"}
    />
  );
}
