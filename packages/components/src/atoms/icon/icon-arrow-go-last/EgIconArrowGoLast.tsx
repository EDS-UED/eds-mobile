import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconArrowGoLastProps } from './EgIconArrowGoLast.types.js';

/** RN icon — eds-arrow-go-last */
export function EgIconArrowGoLast(props: EgIconArrowGoLastProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-arrow-go-last"
      testID={testID ?? 'icon-eds-arrow-go-last'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-arrow-go-last"}
    />
  );
}
