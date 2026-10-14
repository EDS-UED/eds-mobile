import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconWorldDollarProps } from './EgIconWorldDollar.types.js';

/** RN icon — eds-world-dollar */
export function EgIconWorldDollar(props: EgIconWorldDollarProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-world-dollar"
      testID={testID ?? 'icon-eds-world-dollar'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-world-dollar"}
    />
  );
}
