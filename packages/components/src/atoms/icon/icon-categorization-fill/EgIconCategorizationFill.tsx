import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconCategorizationFillProps } from './EgIconCategorizationFill.types.js';

/** RN icon — eds-categorization-fill */
export function EgIconCategorizationFill(props: EgIconCategorizationFillProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-categorization-fill"
      testID={testID ?? 'icon-eds-categorization-fill'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-categorization-fill"}
    />
  );
}
