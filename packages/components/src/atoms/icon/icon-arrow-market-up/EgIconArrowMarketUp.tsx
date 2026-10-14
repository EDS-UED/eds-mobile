import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconArrowMarketUpProps } from './EgIconArrowMarketUp.types.js';

/** RN icon — eds-arrow-market-up */
export function EgIconArrowMarketUp(props: EgIconArrowMarketUpProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-arrow-market-up"
      testID={testID ?? 'icon-eds-arrow-market-up'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-arrow-market-up"}
    />
  );
}
