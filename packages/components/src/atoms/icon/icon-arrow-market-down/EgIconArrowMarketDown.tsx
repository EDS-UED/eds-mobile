import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconArrowMarketDownProps } from './EgIconArrowMarketDown.types.js';

/** RN icon — eds-arrow-market-down */
export function EgIconArrowMarketDown(props: EgIconArrowMarketDownProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-arrow-market-down"
      testID={testID ?? 'icon-eds-arrow-market-down'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-arrow-market-down"}
    />
  );
}
