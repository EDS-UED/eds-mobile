import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconArrowToggleVerticalProps } from './EgIconArrowToggleVertical.types.js';

/** RN icon — eds-arrow-toggle-vertical */
export function EgIconArrowToggleVertical(props: EgIconArrowToggleVerticalProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-arrow-toggle-vertical"
      testID={testID ?? 'icon-eds-arrow-toggle-vertical'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-arrow-toggle-vertical"}
    />
  );
}
