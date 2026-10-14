import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconUsdSettlementProps } from './EgIconUsdSettlement.types.js';

/** RN icon — eds-usd-settlement */
export function EgIconUsdSettlement(props: EgIconUsdSettlementProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-usd-settlement"
      testID={testID ?? 'icon-eds-usd-settlement'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-usd-settlement"}
    />
  );
}
