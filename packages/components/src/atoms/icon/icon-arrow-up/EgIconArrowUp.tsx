import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconArrowUpProps } from './EgIconArrowUp.types.js';

/** RN icon — eds-arrow-up */
export function EgIconArrowUp(props: EgIconArrowUpProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-arrow-up"
      testID={testID ?? 'icon-eds-arrow-up'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-arrow-up"}
    />
  );
}
