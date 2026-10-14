import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconSafelyDollarProps } from './EgIconSafelyDollar.types.js';

/** RN icon — eds-safely-dollar */
export function EgIconSafelyDollar(props: EgIconSafelyDollarProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-safely-dollar"
      testID={testID ?? 'icon-eds-safely-dollar'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-safely-dollar"}
    />
  );
}
