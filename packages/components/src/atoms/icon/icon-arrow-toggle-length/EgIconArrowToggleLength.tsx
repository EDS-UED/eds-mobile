import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconArrowToggleLengthProps } from './EgIconArrowToggleLength.types.js';

/** RN icon — eds-arrow-toggle-length */
export function EgIconArrowToggleLength(props: EgIconArrowToggleLengthProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-arrow-toggle-length"
      testID={testID ?? 'icon-eds-arrow-toggle-length'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-arrow-toggle-length"}
    />
  );
}
