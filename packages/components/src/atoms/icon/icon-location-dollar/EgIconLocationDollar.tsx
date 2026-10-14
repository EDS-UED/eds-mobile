import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconLocationDollarProps } from './EgIconLocationDollar.types.js';

/** RN icon — eds-location-dollar */
export function EgIconLocationDollar(props: EgIconLocationDollarProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-location-dollar"
      testID={testID ?? 'icon-eds-location-dollar'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-location-dollar"}
    />
  );
}
