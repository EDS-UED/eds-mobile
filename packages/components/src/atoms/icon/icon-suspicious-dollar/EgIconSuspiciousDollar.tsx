import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconSuspiciousDollarProps } from './EgIconSuspiciousDollar.types.js';

/** RN icon — eds-suspicious-dollar */
export function EgIconSuspiciousDollar(props: EgIconSuspiciousDollarProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-suspicious-dollar"
      testID={testID ?? 'icon-eds-suspicious-dollar'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-suspicious-dollar"}
    />
  );
}
