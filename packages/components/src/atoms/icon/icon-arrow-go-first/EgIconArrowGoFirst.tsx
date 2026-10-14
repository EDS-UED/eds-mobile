import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconArrowGoFirstProps } from './EgIconArrowGoFirst.types.js';

/** RN icon — eds-arrow-go-first */
export function EgIconArrowGoFirst(props: EgIconArrowGoFirstProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-arrow-go-first"
      testID={testID ?? 'icon-eds-arrow-go-first'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-arrow-go-first"}
    />
  );
}
