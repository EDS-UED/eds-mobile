import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconFlagDollarProps } from './EgIconFlagDollar.types.js';

/** RN icon — eds-flag-dollar */
export function EgIconFlagDollar(props: EgIconFlagDollarProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-flag-dollar"
      testID={testID ?? 'icon-eds-flag-dollar'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-flag-dollar"}
    />
  );
}
