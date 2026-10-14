import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconCategorizationProps } from './EgIconCategorization.types.js';

/** RN icon — eds-categorization */
export function EgIconCategorization(props: EgIconCategorizationProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-categorization"
      testID={testID ?? 'icon-eds-categorization'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-categorization"}
    />
  );
}
